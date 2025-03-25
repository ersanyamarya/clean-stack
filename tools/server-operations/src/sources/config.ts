import { readFileSync, writeFileSync } from 'fs';
import { z } from 'zod';

export const CONFIG_FILE_PATH = '.serverops.config.json';

export const serverSchema = z
  .object({
    name: z.string(),
    host: z.string(),
    user: z.string(),
    password: z.string().optional(),
    privateKey: z.string().optional(),
    port: z.number().default(22),
  })
  .refine(data => data.password || data.privateKey, {
    message: 'Either password or privateKey is required',
    path: ['password'],
  });

export type Server = z.infer<typeof serverSchema>;

export const configSchema = z.object({
  servers: z.array(serverSchema),
  defaultServer: z.string().optional(),
});

export const defaultConfig = {
  servers: [],
  defaultServer: undefined,
};

export const ifFileIsEmptySetDefault = () => {
  try {
    const data = readFileSync(CONFIG_FILE_PATH, 'utf-8');
    if (data.trim() === '') {
      console.log('Config file is empty, creating a new one.');
      writeFileSync(CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 2));
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Config file not found, creating a new one.');
      writeFileSync(CONFIG_FILE_PATH, JSON.stringify(defaultConfig, null, 2));
    } else {
      console.error('Error reading config file:', error);
    }
  }
};

export const saveConfig = (config: z.infer<typeof configSchema>) => {
  writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2));
};
export const loadConfig = (): z.infer<typeof configSchema> => {
  ifFileIsEmptySetDefault();
  try {
    const data = readFileSync(CONFIG_FILE_PATH, 'utf-8');
    return configSchema.parse(JSON.parse(data));
  } catch (error) {
    console.log('Error loading config file:', error);
    if (error instanceof z.ZodError) {
      console.error('Config file validation error:', error.errors);
    }
    if (error.code === 'ENOENT') {
      console.log('Config file not found, creating a new one.');

      saveConfig(defaultConfig);
      return defaultConfig;
    }
  }
};

export const listServers = () => {
  const config = loadConfig();
  return config.servers;
};

export const addServers = (servers: Server[]) => {
  const config = loadConfig();

  const serverSet = new Set(config.servers.map(server => server.name));
  servers.forEach(server => {
    if (!serverSet.has(server.name)) {
      config.servers.push(server);
    }
  });
  saveConfig(config);
};

export const removeServers = (serverNames: string[]) => {
  const config = loadConfig();
  serverNames.forEach(serverName => {
    // check if the server exists
    if (!config.servers.some(server => server.name === serverName)) {
      throw new Error(`Server ${serverName} not found`);
    }
    if (config.defaultServer === serverName) {
      throw new Error(`Cannot remove default server ${serverName}. Please set another server as default first.`);
    }
  });
  config.servers = config.servers.filter(server => !serverNames.includes(server.name));
  saveConfig(config);
};

export const setDefaultServer = (serverName: string) => {
  const config = loadConfig();
  if (!config.servers.some(server => server.name === serverName)) {
    throw new Error(`Server ${serverName} not found`);
  }
  config.defaultServer = serverName;
  saveConfig(config);
};

export const getDefaultServer = () => {
  const config = loadConfig();
  return config.defaultServer;
};

export const getServerByName = (serverName: string) => {
  const config = loadConfig();
  const server = config.servers.find(server => server.name === serverName);
  if (!server) {
    throw new Error(`Server ${serverName} not found`);
  }
  return server;
};
