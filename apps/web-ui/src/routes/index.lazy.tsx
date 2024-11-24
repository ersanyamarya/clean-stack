import { Alert, AlertDescription, AlertTitle } from '@clean-stack/components/alert';
import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@clean-stack/components/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@clean-stack/components/hover-card';
import { createLazyFileRoute } from '@tanstack/react-router';
export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">Hello, world!</h1>
      <p className="text-lg">This is a lazy-loaded route!</p>
      <Button
        onClick={() => {
          alert('Hello, world!');
        }}>
        Click me Now !
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>
            Sit non architecto et laboriosam aut aut. Nobis libero fugiat suscipit. Atque tempore rerum sed ea qui est ea praesentium perferendis.
          </CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      <HoverCard>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>The React Framework – created and maintained by @vercel.</HoverCardContent>
      </HoverCard>
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert>
    </div>
  );
}
