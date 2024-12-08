type BackendConfig = {
  url: string;
};
export const backendConfig: BackendConfig = {
  url: import.meta.env.VITE_MAIN_SERVICE_ADDRESS,
};

export const collectorUrl: string = import.meta.env.VITE_COLLECTOR_ADDRESS;

type AppConfig = {
  appName: string;
  appVersion: string;
};

export const app: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME,
  appVersion: import.meta.env.VITE_APP_VERSION,
};
