import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@clean-stack/components/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@clean-stack/components/form';
import { Input } from '@clean-stack/components/input';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Ghost } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLoginForm } from './-useAuth';
export const Route = createFileRoute('/_public/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation('authentication');
  const { loginForm, onLogin } = useLoginForm();

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t('login')}</CardTitle>
        <CardDescription>{t('loginSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLogin)}>
            <div className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>{t('password')}</FormLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline">
                        {t('forgotPassword')}
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full">
                {t('login')}
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center gap-3">
                <Ghost className="h-5 w-5" />
                {t('loginWithGoogle')}
              </Button>
              <div className="mt-4 text-center text-sm">
                {t('dontHaveAnAccount')}{' '}
                <Link
                  href="#"
                  className="underline">
                  {t('signUp')}
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
