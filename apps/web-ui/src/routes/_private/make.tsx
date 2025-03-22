import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@clean-stack/components/card';
import { Input } from '@clean-stack/components/input';
import { Separator } from '@clean-stack/components/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@clean-stack/components/tooltip';
import { useToast } from '@clean-stack/react-hooks/use-toast';
import { createFileRoute } from '@tanstack/react-router';
import { Copy, Loader2, ThumbsUp, Wand, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { trpc } from '../../providers/TrpcProvider/trpcUtils';

const sidebar = z.object({
  isOpen: z.boolean().optional().default(true),
  selected: z.string().optional().default('home'),
});

export const Route = createFileRoute('/_private/make')({
  validateSearch: sidebar,
  component: RouteComponent,
});

function RouteComponent() {
  const { toast } = useToast();
  const sidebarState = Route.useSearch();
  const navigate = Route.useNavigate();
  const userQuery = trpc.user.useQuery('67726218d9d2abd698ae1b5b');
  const enhancePromptQuery = trpc.enhanceQueryText.useMutation({
    onSettled(data, error, variables, context) {
      if (data) {
        setSuggestions(data.response.suggestions);
      }
    },
  });
  const mongooseAggregationQuery = trpc.generateMongooseAggregation.useMutation();
  const utils = trpc.useUtils();
  const { t } = useTranslation('common');
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The enhanced prompt has been copied to your clipboard',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">Prompt Enhancement Tool</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get AI-powered suggestions to improve your queries about pedestrian data for Würzburg, Germany
        </p>
      </div>

      <Card className="mb-8 shadow-sm border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wand className="h-5 w-5 text-primary" />
            Enter your prompt
          </CardTitle>
          <CardDescription>Type your query about pedestrian data and let AI enhance it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              ref={inputRef}
              placeholder="Example: How many pedestrians visited Main Street last week?"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="flex-1"
            />
            <Button
              disabled={enhancePromptQuery.isPending || !value}
              onClick={() => enhancePromptQuery.mutate(value)}
              className="whitespace-nowrap">
              {enhancePromptQuery.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Enhance Prompt
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card className="mb-8 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Suggested Improvements</CardTitle>
            <CardDescription>Click on any suggestion to apply it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setValue(suggestion);
                          toast({
                            title: 'Suggestion applied',
                            description: 'You can now enhance this prompt further',
                          });
                        }}
                        className="border-primary/20 hover:bg-primary/5 hover:border-primary/30 text-sm">
                        {suggestion.length > 30 ? `${suggestion.substring(0, 30)}...` : suggestion}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{suggestion}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {enhancePromptQuery.data?.response.enhancedPrompt && (
        <Card className="shadow-md border-primary/20 transition-all animate-in fade-in-0 zoom-in-95">
          <CardHeader className="pb-3 bg-primary/5 rounded-t-md">
            <CardTitle className="text-xl flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-primary" />
                Enhanced Result
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyToClipboard(enhancePromptQuery.data?.response.enhancedPrompt || '')}
                className="h-8 px-2">
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Your original prompt: <span className="font-medium text-foreground/80">{value}</span>
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="bg-card rounded-md p-4 border border-border text-card-foreground">
              <p className="leading-relaxed whitespace-pre-wrap">{enhancePromptQuery.data?.response.enhancedPrompt}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-2 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Reset the state
                setValue('');
                setSuggestions([]);
              }}>
              Start Over
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
