import { Button } from '@clean-stack/components/button';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1 className="text-4xl font-bold">Hello, world!</h1>
      <p className="text-lg">This is a lazy-loaded route!</p>
      <Button
        onClick={() => {
          alert('Hello, world!');
        }}>
        Click me Now !
      </Button>
    </>
  );
}
