import { Alert, AlertDescription, AlertTitle } from '@clean-stack/components/alert';
import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@clean-stack/components/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@clean-stack/components/hover-card';
import { Input } from '@clean-stack/components/input';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { trpc } from '../../providers/TrpcProvider/trpcUtils';

const sidebar = z.object({
  isOpen: z.boolean().optional().default(true),
  selected: z.string().optional().default('home'),
});

export const Route = createFileRoute('/_private/')({
  validateSearch: sidebar,
  component: RouteComponent,
});

function RouteComponent() {
  const sidebarState = Route.useSearch();
  const navigate = Route.useNavigate();
  const userQuery = trpc.user.useQuery('67726218d9d2abd698ae1b5b');
  const enhancePromptQuery = trpc.enhanceQueryText.useMutation();
  const utils = trpc.useUtils();
  const { t } = useTranslation('common');
  const [value, setValue] = useState('');
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 p-4">
      <h1 className="text-4xl font-bold">{t('HomePage.description')}</h1>

      <Button onClick={() => navigate({ search: { isOpen: !sidebarState.isOpen } })}>{sidebarState.isOpen ? 'Close' : 'Open'} Sidebar</Button>

      <pre>{JSON.stringify(userQuery.data, null, 2)}</pre>

      <div className="flex space-x-4 w-full">
        <Input
          placeholder="query"
          value={value}
          onChange={e => setValue(e.target.value)}
          // {...debounceFieldProps}
        />
        <Button
          onClick={async () => {
            enhancePromptQuery.mutate({ prompt: value, enhancementContext: 'context' });
          }}>
          Click me Now !
        </Button>
      </div>
      <pre>{JSON.stringify({ data: enhancePromptQuery.data, value }, null, 2)}</pre>

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
