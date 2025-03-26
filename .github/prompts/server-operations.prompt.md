Collecting workspace information# Server Operations Developer Guide

## Overview

The server-operations tool is a powerful CLI utility designed to simplify server management tasks within the Clean Stack ecosystem. It provides a streamlined interface for configuring server connections, executing remote commands, and performing system updates.

## Usage Examples

```bash
# List configured servers
server-operations config list

# Add servers from SSH config
server-operations config add

# Set a default server
server-operations config default

# Run a command on the default server
server-operations server run -d "df -h"

# Update packages on a specific server
server-operations server update -s my-server
```

## Architecture

### Directory Structure

```
server-operations/
├── src/
│   ├── main.ts             # Entry point and command definitions
│   ├── actions/            # Command implementations
│   │   ├── config/         # Configuration commands
│   │   └── server/         # Server operation commands
│   ├── helpers/            # Helper functions
│   ├── sources/            # Data sources and schemas
│   └── utils/              # Utilities for logging, etc.
```

### Key Components

#### 1. Command Structure

The CLI is built using [Commander.js](https://github.com/tj/commander.js/) with two main command groups:

For user interaction, the tool uses [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) for prompts and user input.

- `config` - Manages server configurations
- `server` - Executes operations on servers

#### 2. Configuration Management

Servers are stored in .serverops.config.json with the following schema:

```typescript
interface Server {
  name: string;
  host: string;
  user: string;
  password?: string;
  privateKey?: string;
  port: number;
}

interface ConfigFile {
  servers: Server[];
  defaultServer?: string;
}
```

#### 3. SSH Integration

The tool integrates with the system's SSH configuration:

- Reads servers from `~/.ssh/config`
- Supports private key authentication
- Handles command execution via SSH

## Implementation Details

### Adding New Commands

To add a new command:

1. Create a new action file in `src/actions/`
2. Define your command function
3. Register it in main.ts

Example:

```typescript
// New action in src/actions/server/reboot.ts
export const rebootServer = async (options: RunOnServerOptions) => {
  const serverToRunOn = getServerToRunOn(options);
  logger.info(`Rebooting ${serverToRunOn.name}`);
  await executeBash(generateSSHCommand(serverToRunOn, 'sudo reboot'));
};

// In main.ts
import { rebootServer } from './actions/server/reboot';

serverCommand
  .command('reboot')
  .description('Reboot server')
  .addOption(new Option('-d, --default', 'Reboot default server').conflicts('server').default(false))
  .addOption(new Option('-s, --server <server>', 'Server to reboot').conflicts('default'))
  .action(actionWithTryCatch(rebootServer));
```

### Error Handling

All actions are wrapped with `actionWithTryCatch` to provide consistent error handling:

```typescript
function actionWithTryCatch(action: (...args: any[]) => any) {
  return async (...args: any[]) => {
    try {
      await action(...args);
    } catch (error) {
      logError(error);
    }
  };
}
```

## Best Practices

1. **Always validate server object** before performing operations
2. **Use the helper functions** for SSH command generation
3. **Handle errors gracefully** with appropriate user feedback
4. **Provide clear command descriptions** and help text
5. **Support both default and specific server options** for flexibility

## Common Server Tasks

The tool currently supports:

- **Running commands**: Execute any command on remote servers
- **Updating packages**: Update system packages via apt
- **Managing configuration**: Add/remove/list server configurations
