import { Toaster } from '@clean-stack/components/toaster';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import * as React from 'react';

type RouterContext = {
  isAuthenticated: boolean;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Toaster />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </React.Fragment>
  );
}
