import '@clean-stack/styles/global.css';

import { initFETelemetry } from '@clean-stack/frontend-telemetry';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

import './styles.css';
// Import the generated route tree
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import Resources from './@types/resources';
import { routeTree } from './routeTree.gen';
import { trpc } from './trpc_utils';

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

function App({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:9900/trpc',
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              authorization: 'Bearer 123',
            };
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

// Render the app
const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App>
        <RouterProvider router={router} />
      </App>
    </StrictMode>
  );
}
