import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_public/forget-password')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_public/forget-password"!</div>;
}
