---
sidebar_position: 3
---

# Project Structure

Understanding Clean Stack's monorepo structure and organization.

## Directory Overview

```
clean-stack/
├── PLATFORM_SETUP/        # Infrastructure configuration
├── apps/                  # Client applications
├── domain/               # Business logic and types
├── framework/            # Core framework components
├── platform-features/    # Cross-cutting concerns
├── services/            # Microservices
└── tools/               # Development utilities
```

## Key Directories Explained

### PLATFORM_SETUP

Contains Docker Compose configurations for:

- Observability stack (OpenTelemetry, Grafana)
- Cache stack (Redis)
- Development tools

### Apps

User-facing applications:

- Documentation site
- Web applications
- Mobile apps

### Domain

Core business logic:

- Custom errors
- Domain entities
- gRPC protocol definitions
- Shared types

### Framework

Reusable technical components:

- Koa server essentials
- gRPC communication
- Global types
- Utility functions

### Platform Features

Cross-cutting concerns:

- Telemetry implementation
- Caching mechanisms
- Rate limiting

### Services

Microservice implementations:

- Main service
- User service
- Additional services

### Tools

Development utilities:

- Code coverage tools
- Shell scripts
- Build utilities

## File Organization

Each module follows a consistent structure:

```
module-name/
├── src/
│   ├── lib/           # Core implementation
│   ├── tests/         # Test files
│   └── index.ts       # Public API
├── package.json
└── tsconfig.json
```

## Best Practices

1. **Module Organization**

   - Keep related code together
   - Follow single responsibility principle
   - Maintain clear boundaries

2. **File Naming**

   - Use kebab-case for files
   - Append `.spec.ts` for tests
   - Use meaningful names

3. **Code Structure**
   - Export public API through index.ts
   - Keep implementation details private
   - Document public interfaces

## Next Steps

<!--
- Explore [Framework Components](../framework/overview)
- Learn about [Platform Features](../platform-features/overview)
- Understand [Clean Architecture](../architecture/clean-architecture) -->
