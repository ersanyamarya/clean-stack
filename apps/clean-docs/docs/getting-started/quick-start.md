---
sidebar_position: 1
---

# Quick Start Guide

Get up and running with Clean Stack in minutes. This guide will help you create your first Clean Stack project and understand its basic structure.

## Prerequisites

- Node.js 18 or higher
- Bun 1.0 or higher
- Docker and Docker Compose
- Git

## Create Your First Project

```bash
# Create a new Clean Stack project
bun create clean-stack-app my-first-app

# Navigate to project directory
cd my-first-app

# Install dependencies
bun install
```

## Start Development Environment

```bash
# Start platform services (Redis, OpenTelemetry, etc.)
bun run platform:all

# Start development server
bun run dev
```

Your development environment is now running:

- Main service: http://localhost:3000
- User service: http://localhost:3001
- Grafana (Observability): http://localhost:3000
- Redis Commander: http://localhost:13333

## Project Verification

Let's verify your setup by making a test request:

```bash
curl http://localhost:3000/health
```

You should see:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## Additional Verification Steps

After starting the development environment, you can perform the following checks:

1. **Verify Redis Connection**:

   ```bash
   redis-cli ping
   ```

   You should see:

   ```
   PONG
   ```

2. **Check OpenTelemetry Metrics**: Visit `http://localhost:8889/metrics` to ensure metrics are being collected.

3. **Access Grafana Dashboards**: Open `http://localhost:3000` in your browser and log in with the default credentials (if configured).

## Next Steps

- Learn about the [Project Structure](./project-structure)
<!-- - Explore [Platform Features](../platform-features/overview) -->
- Read about our [Architecture Philosophy](../architecture/philosophy)

## Related Resources

- [Installation Guide](./installation)
- [Project Structure](./project-structure)
- [Observability Stack](../platform-features/observability/otel-clean-stack)
- [Architecture Philosophy](../architecture/philosophy)
