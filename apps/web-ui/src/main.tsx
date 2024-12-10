import './utils/init';

import './utils/i18n';

import '@clean-stack/styles/global.css';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { useGlobalState } from './global-state/state';
import TrpcQueryProvider from './providers/TrpcProvider';
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    isAuthenticated: false,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { isAuthenticated } = useGlobalState();
  return (
    <TrpcQueryProvider>
      <RouterProvider
        router={router}
        context={{ isAuthenticated: isAuthenticated() }}
      />
    </TrpcQueryProvider>
  );
}

// Render the app
const rootElement = document.getElementById('root');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
