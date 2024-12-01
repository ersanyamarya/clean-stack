import '@clean-stack/styles/global.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

import './styles.css';
// Import the generated route tree
import { initFETelemetry } from 'frontend-telemetry';
import Resources from './@types/resources';
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: string;
    resources: Resources;
  }
}

initFETelemetry({
  appName: 'my-react-app',
  appVersion: '1.0.0',
  collectorUrl: 'http://localhost:4318',
  initiateTelemetry: true,
});

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',
    debug: true,

    // Options for language detector
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'],
      caches: ['localStorage'],
    },
    defaultNS: 'common',
  });

const loadingMarkup = (
  <div className="py-4 text-center">
    <h3>Loading..</h3>
  </div>
);

// Render the app
const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
