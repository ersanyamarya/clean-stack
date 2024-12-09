import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import * as React from 'react';
import LanguageSwitcher from '../widgets/language-switcher';
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <LanguageSwitcher />
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
