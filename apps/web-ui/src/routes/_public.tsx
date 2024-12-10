import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import LanguageSwitcher from '../widgets/language-switcher';
export const Route = createFileRoute('/_public')({
  component: RouteComponent,
  notFoundComponent: () => <h1>Not Found</h1>,
  beforeLoad: async ({ context }) => {
    const { isAuthenticated } = context;
    if (isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex flex-row h-screen">
      <div className="flex-1  bg-primary p-4  h-screen justify-center items-center hidden md:flex ">
        <h1 className="text-primary-foreground text-4xl">Where Magic Happens !</h1>
      </div>
      <div className="flex-1  justify-center items-center  flex">
        <FloatingButton />
        <Outlet />
      </div>
    </div>
  );
}

function FloatingButton() {
  return (
    <div className="fixed bottom-4 right-4">
      <LanguageSwitcher />
    </div>
  );
}
