# <img src="./apps/clean-docs/static/img/logo.svg" alt="Logo" width="64"/> Clean Stack

![Clean Stack](https://img.shields.io/badge/Clean%20Stack-v1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

Clean Stack is a modern, opinionated, and full-stack TypeScript boilerplate for building scalable and maintainable web applications. It leverages Nx for monorepo management, providing a set of best practices, tools, and libraries to streamline the development process and ensure code quality.

## Key Features

- **Monorepo Structure**: Managed using Nx, allowing for efficient organization and scaling of multiple packages.
- **TypeScript Everywhere**: Enjoy the benefits of static typing across the entire stack.
- **Microservices Architecture**: Build scalable applications using a distributed system of loosely coupled services.
- **Observability**: Integrated observability stack using OpenTelemetry, Prometheus, Grafana, Loki, and Tempo.
- **Cache Management**: Modular cache management with support for Redis and other cache stores.
- **Code Quality**: Enforced through ESLint, Prettier, and TypeScript.

## Installation and Setup

To get started with Clean Stack, ensure you have the following prerequisites:

- Node.js (version X.X.X or higher)
- npm or yarn

Clone the repository and install dependencies:

```bash
git clone git@github.com:ersanyamarya/clean-stack.git
cd clean-stack
npm install
```

## Available Scripts

- **`clean`**: Resets the workspace and cleans all build artifacts.
- **`dep-graph`**: Visualizes the dependency graph of the project.
- **`generate:docs`**: Generates documentation using Typedoc and serves it locally.
- **`platform:cache`**: Starts the cache platform using Docker Compose.
- **`platform:observability`**: Starts the observability platform using Docker Compose.

## Usage

To run the development server:

```bash
npm run dev
```

To build the project:

```bash
npm run build
```

To deploy the project, follow the deployment guide in the `docs/deployment.md` file.

## Contributing

We welcome contributions to Clean Stack! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Additional Resources

- [Documentation](https://ersanyamarya.github.io/clean-stack/)
- [Community Forum](https://your-community-link)
- [Tutorials](https://your-tutorials-link)

For any questions or feedback, please contact us at [er.sanyam.arya@gmail.com](mailto:er.sanyam.arya@gmail.com).
