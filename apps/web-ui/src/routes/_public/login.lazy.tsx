import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@clean-stack/components/card';
import { Form } from '@clean-stack/components/form';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { Ghost } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TextInputFormField } from '../../widgets/TextInputFormField';
import { useLoginForm } from './-useAuthForms';

export const Route = createLazyFileRoute('/_public/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation('authentication');
  const { loginForm, onLogin, isAuthLoading } = useLoginForm();

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
              <TextInputFormField
                control={loginForm.control}
                name="email"
                label={t('email')}
                type="email"
                autoComplete="email"
                isLoading={isAuthLoading}
              />
              <TextInputFormField
                control={loginForm.control}
                name="password"
                label={t('password')}
                type="password"
                autoComplete="current-password"
                isLoading={isAuthLoading}
                rightElement={
                  <Link
                    to="/forget-password"
                    className="inline-block text-sm underline">
                    {t('forgotPassword')}
                  </Link>
                }
              />
              <Button
                disabled={isAuthLoading}
                type="submit"
                className="w-full">
                {t('login')}
              </Button>
              <Button
                disabled
                variant="outline"
                className="w-full flex items-center gap-3">
                <Ghost className="h-5 w-5" />
                {t('loginWithGoogle')}
              </Button>
              <div className="mt-4 text-center text-sm">
                {t('dontHaveAnAccount')}{' '}
                <Link
                  to="/register"
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
