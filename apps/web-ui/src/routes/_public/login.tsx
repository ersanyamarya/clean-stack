import { Button } from '@clean-stack/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@clean-stack/components/card';
import { Input } from '@clean-stack/components/input';
import { Label } from '@clean-stack/components/label';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full">
            Login
          </Button>
          <Button
            variant="outline"
            className="w-full">
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="#"
            className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
