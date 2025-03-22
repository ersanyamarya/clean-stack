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
      <main className="flex flex-col w-full h-screen overflow-x-hidden bg-background">
        <header className="sticky top-0 z-10 flex items-center h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger
            onClick={() => navigate({ search: { isOpen: !sidebarState.isOpen } })}
            className="mr-4"
          />
          <div className="flex items-center justify-between w-full">
            <h1 className="text-lg font-semibold">{sidebarState.selected === 'home' ? 'Home' : 'Better Prompt'}</h1>
            <LanguageSwitcher />
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </div>
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
      <SidebarHeader className="flex items-center p-4 h-14 border-b">
        <h1 className="font-semibold text-xl">Clean Stack</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/80 transition-colors"
              activeProps={{
                className: 'bg-primary/10 text-primary font-medium',
              }}>
              <HomeIcon size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/make"
              className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/80 transition-colors"
              activeProps={{
                className: 'bg-primary/10 text-primary font-medium',
              }}>
              <MagnetIcon size={18} />
              <span>Better Prompt</span>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-2 p-4 border-t mt-auto">
        <LanguageSwitcher />
        <Button
          onClick={onLogoutClick}
          className="w-full justify-center"
          variant="outline">
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
