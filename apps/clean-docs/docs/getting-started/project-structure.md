---
sidebar_position: 3
---

# Project Structure

A detailed guide to Clean Stack's monorepo structure and organization.

## Main Structure

```
clean-stack/
├── apps/                  # Frontend applications
│   ├── clean-docs/       # Documentation site
│   ├── web-ui/          # Web application
│   └── web-ui-e2e/      # E2E tests
├── domain/               # Core business domain
│   ├── custom-errors/    # Error definitions
│   ├── domain_user/     # User domain
│   └── grpc-proto/      # Protocol definitions
├── framework/            # Technical foundation
│   ├── global-types/    # Shared types
│   ├── grpc-essentials/ # gRPC utilities
│   └── utilities/       # Common utilities
├── platform-features/    # Cross-cutting concerns
│   ├── backend-telemetry/
│   ├── cache/
│   └── rate-limiter/
├── services/            # Backend services
│   ├── main-service/
│   ├── user-service/
│   └── llm-service/
└── tools/               # Development tools
```

## Key Components Explained

### Apps (`apps/`)
Each application is an NX project with its own:
- Configuration (`project.json`, `tsconfig.json`)
- Build setup (Vite/other bundler config)
- Unit and E2E tests
- Environment files

### Domain (`domain/`)
Contains pure business logic:
```
domain/domain_user/
├── src/
│   ├── lib/              # Core implementation
│   │   ├── entities/     # Domain entities
│   │   ├── usecases/    # Business logic
│   │   └── repositories/ # Data contracts
│   ├── tests/           # Unit tests
│   └── index.ts         # Public API
├── project.json         # NX configuration
└── tsconfig.json       # TypeScript setup
```

### Framework (`framework/`)
Technical components that support the domain:
- **global-types**: Shared TypeScript definitions
- **grpc-essentials**: Base gRPC configuration
- **koa-server-essentials**: HTTP server setup
- **utilities**: Shared helper functions

### Platform Features (`platform-features/`)
Cross-cutting functionality:
- **backend-telemetry**: OpenTelemetry integration
- **cache**: Redis-based caching
- **rate-limiter**: Request throttling

### Services (`services/`)
Each service follows:
```
services/user-service/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── routes/         # API routes
│   └── index.ts       # Service entry
├── Dockerfile         # Container config
└── project.json      # NX configuration
```

## Configuration Files

### Root Level
- `nx.json`: NX workspace configuration
- `package.json`: Monorepo dependencies
- `tsconfig.base.json`: Base TypeScript config
- `eslint.config.js`: Linting rules
- `.prettierrc.js`: Code formatting

### Project Level
Each project has:
- `project.json`: NX project settings
- `tsconfig.json`: Project-specific TS config
- `vite.config.ts`: Build configuration (if applicable)

## Development Guidelines

### Adding New Code
1. **Libraries**: Add to appropriate `domain/` or `framework/` directory
2. **Features**: Add to `platform-features/` if cross-cutting
3. **Services**: Create new service in `services/`
4. **UI**: Add to `apps/web-ui/` or create new app

### File Organization
- Keep related code together
- One feature per directory
- Consistent naming:
  - `*.spec.ts` for tests
  - `index.ts` for public API
  - kebab-case for files
