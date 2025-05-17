# Clean Stack Project Guide (Instructions for AI Assistant)

**Objective:** This document guides the AI assistant in understanding the Clean Stack monorepo structure, technology choices, coding standards, and best practices. Please adhere to these guidelines when generating or modifying code.

Clean Stack is a monorepo built using NX, designed to provide a clean and scalable foundation for modern applications.

## Monorepo Structure Explained

Clean Stack follows a true monorepo architecture with a single `package.json` at the root level that manages all dependencies and scripts for the entire project.

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
- [**eslint.config.js**](../eslint.config.js): Configures linting rules for the entire workspace. **Ensure generated code adheres to these rules.**
- [**.prettierrc.js**](../.prettierrc.js): Contains formatting rules. **Generated code must conform to these formatting standards.**

## Technology Choices

- **Bun as Package Manager**: Project uses bun as package manager.
- **Koa Over Express**: **Generate backend code using Koa, not Express.**
- **gRPC for Service Communication**: **Use gRPC patterns when generating code for inter-service communication.**
- **NX**: Provides the monorepo structure, task management, and build caching.

## Formatting and Code Style

The monorepo uses Prettier for code formatting. The configuration is defined in the [`.prettierrc.js`](../.prettierrc.js) file. To format your code, run the following command:

```bash
bun run format
```

**Always ensure code is formatted according to `.prettierrc.js` before finalizing suggestions.**

Make use of the NX MCP server when needed.
