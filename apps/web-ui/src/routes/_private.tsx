import { Button } from '@clean-stack/components/button';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import useAuthState from '../global-state';
import LanguageSwitcher from '../widgets/language-switcher';

export const Route = createFileRoute('/_private')({
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
  async function onLogoutClick() {
    await logout();
    window.location.href = '/login';
  }

  return (
    <div>
      <LanguageSwitcher />
      <Button onClick={onLogoutClick}>Logout</Button>
      <Outlet />
    </div>
  );
}
