# Clean Stack Project Guide

Clean Stack is a monorepo built using NX, designed to provide a clean and scalable foundation for modern applications.

## Monorepo Structure Explained

Clean Stack follows a true monorepo architecture with a single `package.json` at the root level that manages all dependencies and scripts for the entire project. This centralized approach ensures:

| Aspect                | Benefit                                                |
| --------------------- | ------------------------------------------------------ |
| Code Sharing          | Seamless sharing of types, utilities, and domain logic |
| Dependency Management | Centralized versioning and updates                     |
| Build Optimization    | Intelligent caching and selective rebuilds             |
| Testing               | Unified test coverage and integration testing          |

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

- **PLATFORM_SETUP**: Contains Docker Compose configurations for infrastructure components like the observability stack (OpenTelemetry, Grafana) and cache stack (Redis).
- **apps**: This directory houses user-facing applications such as the documentation site (`apps/clean-docs`) (built with Docusaurus) and web applications (`apps/web-ui`).
- **domain**: Contains core business logic, custom errors, domain entities, gRPC protocol definitions, and shared types. For example, `domain/domain_user`.
- **framework**: Includes reusable technical components like Koa server essentials, gRPC communication setup, global types, and utility functions. See `framework/utilities` for an example.
- **platform-features**: Implements cross-cutting concerns such as telemetry, caching mechanisms, and rate limiting. See caching.md for caching architecture.
- **services**: Contains microservice implementations, such as a main service or user service.
- **tools**: Includes development utilities like code coverage tools and build scripts. See `tools/merge-coverage` for code coverage tools.

## Additional Key Files in the Monorepo

In addition to the directory structure, the following files are critical for the monorepo's configuration and operation:

- [**nx.json**](../nx.json): Located at the root of the project, this file contains the NX workspace configuration, including project dependencies and task runners.
- [**package.json**](../package.json): Also located at the root, this file manages the monorepo's dependencies, scripts, and workspace settings.
- [**tsconfig.base.json**](../tsconfig.base.json): Defines the base TypeScript configuration shared across all projects in the monorepo.
- [**eslint.config.js**](../eslint.config.js): Configures linting rules for the entire workspace to ensure code quality and consistency.
- [**.prettierrc.js**](../.prettierrc.js): Contains formatting rules for the project, ensuring consistent code style across all files.

## Technology Choices

- **Bun as Package Manager**: Project uses bun as package manager.
- **Koa Over Express**: Project uses Koa instead of Express.
- **gRPC for Service Communication**: Project uses gRPC for internal service communication.
- **NX**: Provides the monorepo structure, task management, and build caching.

## Formatting and Code Style

The monorepo uses Prettier for code formatting. The configuration is defined in the [`.prettierrc.js`](../.prettierrc.js) file. To format your code, run the following command:

```bash
bun run format
```

This ensures that all files adhere to the project's style guidelines.

## Best Practices

1.  **Module Organization**

    - Keep related code together.
    - Follow the single responsibility principle.
    - Maintain clear boundaries between modules.

2.  **File Naming**

    - Use kebab-case for files.
    - Append `.spec.ts` for test files.
    - Use meaningful names.

3.  **Code Structure**

    - Export the public API through `index.ts`.
    - Keep implementation details private.
    - Document public interfaces.

## Coding Standards for a Great TypeScript Project

- **Functional Programming & Dependency Inversion**: Prefer functional programming patterns and dependency inversion. Write pure functions where possible. Inject dependencies rather than creating them within functions. This promotes better testing and reusability.

- **Code Reusability & Testability**: Design code with reusability and testability as primary concerns. Break down complex functions into smaller, reusable units. Keep side effects isolated and dependencies explicit.

- **Type Safety**: Always use `strict` mode in TypeScript by enabling it in `tsconfig.json`. Prefer `unknown` over `any` for better type safety. Use `readonly` for immutable data structures.

- **Code Organization**: Group related files into modules. Use `index.ts` files to re-export module components. Keep public APIs clean and minimal.

- **Naming Conventions**: Use `PascalCase` for classes and interfaces, and `camelCase` for variables and functions. Prefix interfaces with `I` only if it improves clarity.

- **Error Handling**: Use custom error classes for domain-specific errors. Always handle promises with `.catch` or `try-catch` blocks.

- **Testing**: Write unit tests for all critical logic using Vitest. Use descriptive test names and mock external dependencies in tests.

- **Documentation**: Add JSDoc comments for all public methods and classes. Document complex logic with inline comments.

- **Linting and Formatting**: Use ESLint to enforce coding standards and run Prettier before committing code.

- **Performance**: Avoid unnecessary computations in loops and use lazy loading for large modules.

- **Version Control**: Commit small, focused changes and write clear, descriptive commit messages.
