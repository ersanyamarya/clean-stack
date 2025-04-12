---
sidebar_position: 1
---

# Quick Start Guide

Get up and running with Clean Stack in minutes.

## Prerequisites

Before you begin, ensure you have installed:

- Node.js 18 or higher
- Bun 1.0 or higher
- Docker and Docker Compose

Need help installing? Check our detailed [Installation Guide](./installation).

## Create Your Project

```bash
# Create a new Clean Stack project
bun create clean-stack-app my-app

cd my-app
bun install
```

## Start Development Environment

1. Start platform services:

```bash
bun run platform:all
```

2. Start development server:

```bash
bun run dev
```

Your environment is now running with:

- Main service: http://localhost:3000
- User service: http://localhost:3001
- Grafana (Observability): http://localhost:3000
- Redis Commander: http://localhost:13333

## Verify Setup

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## Next Steps

1. **Explore Your Project**: Review the [Project Structure](./project-structure) to understand the codebase organization.

2. **Platform Features**: Learn about built-in capabilities:

   - [Caching](../platform-features/caching)
   - [Observability](../platform-features/observability/otel-clean-stack)

3. **Architecture**: Understand our [Architecture Philosophy](../architecture/philosophy)
