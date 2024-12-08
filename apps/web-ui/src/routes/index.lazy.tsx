import { Alert, AlertDescription, AlertTitle } from '@clean-stack/components/alert';
import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@clean-stack/components/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@clean-stack/components/hover-card';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { trpc } from '../trpc_utils';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const userQuery = trpc.user.useQuery('6755f38dac29504677e61456');
  const utils = trpc.useUtils();
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">{t('HomePage.description')}</h1>
      <p className="text-lg">This is a lazy-loaded route!</p>
      <pre>{JSON.stringify(userQuery.data, null, 2)}</pre>
      <Button
        onClick={async () => {
          const users = await utils.users.fetch();
          console.log(users);
        }}>
        Click me Now !
      </Button>
      <pre></pre>
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
