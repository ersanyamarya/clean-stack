import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@clean-stack/components/card';
import { Input } from '@clean-stack/components/input';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2, Wand } from 'lucide-react';
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
const SUGGESTIONS = [
  'What is the pedestrian count for Schönbornstraße during each weather conditions?',
  'Provide the pedestrian count for each weather condition for Schönbornstraße at on 1 January 2025',
  'List all streets with more than 1000 pedestrians for each weather condition.',
];
function RouteComponent() {
  const sidebarState = Route.useSearch();
  const navigate = Route.useNavigate();
  const userQuery = trpc.user.useQuery('67726218d9d2abd698ae1b5b');
  const enhancePromptQuery = trpc.enhanceQueryText.useMutation({});
  const mongooseAggregationQuery = trpc.generateMongooseAggregation.useMutation();
  const utils = trpc.useUtils();
  const { t } = useTranslation('common');
  const [value, setValue] = useState('');
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      {/* <h1 className="text-4xl font-bold">{t('HomePage.description')}</h1>
      <Button onClick={() => navigate({ search: { isOpen: !sidebarState.isOpen } })}>{sidebarState.isOpen ? 'Close' : 'Open'} Sidebar</Button>
      <code>
        <pre>{JSON.stringify(userQuery.data, null, 2)}</pre>
      </code> */}
      <h1 className="text-4xl font-bold"> Pedestrian Data for Würzburg, Germany</h1>
      <div className="flex space-x-4 w-full">
        <Input
          placeholder="query"
          value={value}
          onChange={e => setValue(e.target.value)}
          // {...debounceFieldProps}
        />
        <Button
          disabled={mongooseAggregationQuery.isPending || !value}
          onClick={async () => {
            mongooseAggregationQuery.mutate(value);
          }}>
          {mongooseAggregationQuery.isPending ? <Loader2 className="animate-spin" /> : <Wand size={24} />}
          Get Results !
        </Button>
      </div>
      <br />
      <br />
      <div className="flex space-x-4  w-full gap-2 justify-center flex-col">
        {SUGGESTIONS.map((suggestion, index) => (
          <Button
            variant="secondary"
            key={index}
            onClick={async () => {
              setValue(suggestion);
            }}>
            {suggestion}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results from the query</CardTitle>
          <CardDescription>{value}</CardDescription>
        </CardHeader>
        <CardContent>
          <pre>{JSON.stringify(mongooseAggregationQuery.data, null, 2)}</pre>
        </CardContent>
        <CardFooter>Pedestrian Würzburg, Germany</CardFooter>
      </Card>
      {/* <HoverCard>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>The React Framework – created and maintained by @vercel.</HoverCardContent>
      </HoverCard>
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert> */}
    </div>
  );
}
