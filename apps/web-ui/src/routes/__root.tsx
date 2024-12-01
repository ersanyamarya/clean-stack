import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import * as React from 'react';
import LanguageSwitcher from '../widgets/language-switcher';
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <LanguageSwitcher />
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
