---
sidebar_position: 2
---

# Installation Guide

A comprehensive guide to installing and configuring Clean Stack in your development environment.

## System Requirements

### Required Software

| Software       | Minimum Version | Recommended Version |
| -------------- | --------------- | ------------------- |
| Node.js        | 18.0.0          | 20.0.0              |
| Bun            | 1.0.0           | Latest              |
| Docker         | 20.10.0         | Latest              |
| Docker Compose | 2.0.0           | Latest              |
| Git            | 2.0.0           | Latest              |

### Hardware Requirements

- 8GB RAM (minimum)
- 4 CPU cores (recommended)
- 20GB free disk space

## Installation Steps

### 1. Install Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Docker

Follow the official Docker installation guide for your operating system:

- [Docker for Windows](https://docs.docker.com/desktop/windows/install/)
- [Docker for macOS](https://docs.docker.com/desktop/mac/install/)
- [Docker for Linux](https://docs.docker.com/engine/install/)

### 3. Install Clean Stack CLI

```bash
bun install -g @clean-stack/cli
```

### 4. Verify Installation

```bash
clean-stack --version
```

## Development Tools Setup

### IDE Configuration

We recommend using Visual Studio Code with these extensions:

- ESLint
- Prettier
- Proto3
- Docker
- MongoDB for VS Code

### Environment Setup

1. Clone the configuration files:

```bash
clean-stack init-config
```

2. Configure your environment variables:

```bash
cp .env.example .env
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**

```bash
# Check for port usage
lsof -i :3000
lsof -i :3001
```

2. **Docker Issues**

```bash
# Reset Docker environment
docker system prune -a
```

## Common Errors and Fixes

### Error: "Command not found: bun"

**Cause**: Bun is not installed or not added to the system PATH. **Solution**:

1. Verify installation by running `bun --version`.
2. If not installed, follow the [Bun installation guide](https://bun.sh/install).
3. Ensure the Bun binary path is added to your system's PATH variable.

### Error: "Docker daemon not running"

**Cause**: Docker is not started on your system. **Solution**:

1. Start the Docker application on your system.
2. Verify by running `docker info`.

### Error: "Port already in use"

**Cause**: Another application is using the required port. **Solution**:

1. Identify the process using the port:
   ```bash
   lsof -i :3000
   ```
2. Stop the conflicting process or change the port in the configuration.

### Error: "Permission denied" during file operations

**Cause**: Insufficient permissions to access certain files or directories. **Solution**:

1. Use `sudo` for commands requiring elevated privileges.
2. Check file permissions and ownership using `ls -l`.

For more troubleshooting tips, refer to the [Troubleshooting Guide](./installation#troubleshooting).

## Next Steps

- Follow our [Quick Start Guide](./quick-start)
- Learn about [Project Structure](./project-structure)
