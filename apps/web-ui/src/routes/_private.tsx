import { Button } from '@clean-stack/components/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from '@clean-stack/components/sidebar';
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { HomeIcon, MagnetIcon } from 'lucide-react';
import { z } from 'zod';
import useAuthState from '../global-state';
import LanguageSwitcher from '../widgets/LanguageSwitcher';

const sidebar = z.object({
  isOpen: z.boolean().optional().default(true),
  selected: z.string().optional().default('home'),
});

export const Route = createFileRoute('/_private')({
  validateSearch: sidebar,
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { isAuthenticated } = context;
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});

function RouteComponent() {
  const sidebarState = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <SidebarProvider
      title="Clean Stack"
      open={sidebarState.isOpen}>
      <AppSidebar />
      <main className="flex flex-col w-full h-screen overflow-x-hidden">
        <SidebarTrigger onClick={() => navigate({ search: { isOpen: !sidebarState.isOpen } })} />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export function AppSidebar() {
  const { logout } = useAuthState();
  async function onLogoutClick() {
    await logout();
    window.location.href = '/login';
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <h1>Clean Stack</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2 p-2"
              activeProps={{
                className: 'bg-primary-foreground text-primary',
              }}>
              <HomeIcon size={24} />
              <p>Home</p>
            </Link>
            <Link
              to="/make"
              className="flex items-center space-x-2 p-2"
              activeProps={{
                className: 'bg-primary-foreground text-primary',
              }}>
              <MagnetIcon size={24} />
              <p>Better Prompt</p>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <LanguageSwitcher />
        <Button onClick={onLogoutClick}>Logout</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
// <div>
//   <Button onClick={() => navigate({ search: { isOpen: !sidebarState.isOpen } })}>{sidebarState.isOpen ? 'Close' : 'Open'} Sidebar</Button>
//   <LanguageSwitcher />
//   <Button onClick={onLogoutClick}>Logout</Button>
//   <pre>{JSON.stringify(sidebarState, null, 2)}</pre>
//   <Outlet />
// </div>;
