import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/forget-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/forget-password"!</div>
}
