import { buttonVariants } from '@clean-stack/components/button';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from '@clean-stack/components/menubar';
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
      <div className="flex items-center justify-between p-4">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New Window</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Share</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Link
          className={buttonVariants({ variant: 'outline' })}
          to="/">
          Home
        </Link>
        <Link
          className={buttonVariants({ variant: 'outline' })}
          to="/about">
          About
        </Link>
        <LanguageSwitcher />
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
