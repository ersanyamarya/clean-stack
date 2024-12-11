import { Button } from '@clean-stack/components/button';
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
  const { logout } = useAuthState();
  const sidebarState = Route.useSearch();
  const navigate = Route.useNavigate();
  async function onLogoutClick() {
    await logout();
    window.location.href = '/login';
  }

  return (
    <div>
      <Button onClick={() => navigate({ search: { isOpen: !sidebarState.isOpen } })}>{sidebarState.isOpen ? 'Close' : 'Open'} Sidebar</Button>
      <LanguageSwitcher />
      <Button onClick={onLogoutClick}>Logout</Button>
      <pre>{JSON.stringify(sidebarState, null, 2)}</pre>
      <Outlet />
    </div>
  );
}
