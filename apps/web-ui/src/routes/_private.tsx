import { Button } from '@clean-stack/components/button';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { account, isAuthenticated } from '../appwriteClient';
import LanguageSwitcher from '../widgets/language-switcher';

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!(await isAuthenticated())) {
      throw redirect({ to: '/login' });
    }
  },
});

function RouteComponent() {
  async function onLogoutClick() {
    try {
      await account.deleteSession('current');
      window.location.href = '/login';
    } catch (error) {
      console.log({ onLogoutClick: error });
    }
  }

  return (
    <div>
      <LanguageSwitcher />
      <Button onClick={onLogoutClick}>Logout</Button>
      <Outlet />
    </div>
  );
}
