import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@clean-stack/components/card';
import { Input } from '@clean-stack/components/input';
import { useToast } from '@clean-stack/react-hooks/use-toast';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronRight, Loader2, Wand } from 'lucide-react';
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
  const { toast } = useToast();
  const sidebarState = Route.useSearch();
  const navigate = Route.useNavigate();
  const userQuery = trpc.user.useQuery('67726218d9d2abd698ae1b5b');
  const enhancePromptQuery = trpc.enhanceQueryText.useMutation({});
  const mongooseAggregationQuery = trpc.generateMongooseAggregation.useMutation({
    onError(error) {
      toast({ title: 'Error', description: error.message, type: 'foreground', color: 'red' });
    },
  });
  const utils = trpc.useUtils();
  const { t } = useTranslation('common');
  const [value, setValue] = useState('');

  // Function to format JSON results for better readability
  const formatResults = (data: any) => {
    if (!data) return null;

    try {
      if (Array.isArray(data)) {
        return (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-md bg-muted/30">
                {Object.entries(item).map(([key, val]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[120px_1fr] gap-2 py-1 border-b border-muted last:border-0">
                    <span className="font-medium text-muted-foreground">{key}:</span>
                    <span>{String(val)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div className="space-y-2">
            {Object.entries(data).map(([key, val]) => (
              <div
                key={key}
                className="grid grid-cols-[120px_1fr] gap-2 py-1 border-b border-muted last:border-0">
                <span className="font-medium text-muted-foreground">{key}:</span>
                <span>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</span>
              </div>
            ))}
          </div>
        );
      }
    } catch (e) {
      return <pre className="text-sm overflow-auto p-2 bg-muted/20 rounded-md">{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Pedestrian Data for Würzburg, Germany</h1>

      {/* Search section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Enter your query about pedestrian data..."
            value={value}
            onChange={e => setValue(e.target.value)}
            className="flex-1"
          />
          <Button
            disabled={mongooseAggregationQuery.isPending || !value}
            onClick={() => mongooseAggregationQuery.mutate(value)}
            className="min-w-[140px]">
            {mongooseAggregationQuery.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand className="mr-2 h-4 w-4" />}
            Get Results
          </Button>
        </div>
      </div>

      {/* Suggestions section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Suggested Queries</h2>
        <div className="flex flex-wrap gap-3">
          {SUGGESTIONS.map((suggestion, index) => (
            <Button
              variant="outline"
              size="sm"
              key={index}
              className="flex items-center text-left justify-between group transition-all"
              onClick={() => {
                setValue(suggestion);
                toast({ title: 'Suggestion applied', description: 'Query updated' });
              }}>
              <span className="line-clamp-1">{suggestion}</span>
              <ChevronRight className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          ))}
        </div>
      </div>

      {/* Results section */}
      {(mongooseAggregationQuery.data || mongooseAggregationQuery.isPending) && (
        <Card className="w-full shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Results</CardTitle>
            <CardDescription className="line-clamp-2">{value}</CardDescription>
          </CardHeader>

          <CardContent>
            {mongooseAggregationQuery.isPending ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              formatResults(mongooseAggregationQuery.data)
            )}
          </CardContent>

          <CardFooter className="text-sm text-muted-foreground pt-3 border-t">Pedestrian data for Würzburg, Germany</CardFooter>
        </Card>
      )}
    </div>
  );
}
