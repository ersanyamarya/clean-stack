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
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
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
      <main>
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
          <SidebarGroupContent>
            <h2> Apple</h2>
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
