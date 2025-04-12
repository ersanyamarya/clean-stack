---
sidebar_position: 4
---

# Infrastructure Setup

Clean Stack provides pre-configured Docker Compose setups for all platform components in the `PLATFORM_SETUP` directory.

## Observability Stack

Located in `PLATFORM_SETUP/observability_stack`:

### Components

- OpenTelemetry Collector
- Prometheus for metrics
- Loki for logs
- Tempo for traces
- Grafana for visualization

### Configuration Example

```yaml
version: '3.8'
services:
  otel-collector:
    image: otel/opentelemetry-collector-contrib
    ports:
      - '4317:4317' # OTLP gRPC
      - '4318:4318' # OTLP HTTP
    volumes:
      - ./config/otel-collector-config.yml:/etc/otelcol/config.yaml

  prometheus:
    image: prom/prometheus
    ports:
      - '9090:9090'
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - '3000:3000'
    volumes:
      - ./config/grafana.ini:/etc/grafana/grafana.ini
      - ./config/datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml
```

## Cache Stack

Located in `PLATFORM_SETUP/cache_stack`:

### Components

- Redis for caching and rate limiting
- Redis Commander for management UI

### Configuration Example

```yaml
version: '3.8'
services:
  redis:
    image: redis:alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  redis-commander:
    image: rediscommander/redis-commander
    ports:
      - '8081:8081'
    environment:
      - REDIS_HOSTS=local:redis:6379
```

## MongoDB Stack

Located in `PLATFORM_SETUP/mongo_stack`:

### Components

- MongoDB database
- Mongo Express UI

### Configuration Example

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo
    ports:
      - '27017:27017'
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

  mongo-express:
    image: mongo-express
    ports:
      - '8082:8081'
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongodb
      - ME_CONFIG_MONGODB_AUTH_USERNAME=admin
      - ME_CONFIG_MONGODB_AUTH_PASSWORD=password
```

## Development Commands

Start all platform services:

```bash
bun run platform:all
```

Individual stack controls:

```bash
# Start/stop observability stack
./tools/shell_scripts/observability-stack.sh up
./tools/shell_scripts/observability-stack.sh down

# Start/stop cache stack
./tools/shell_scripts/cache-stack.sh up
./tools/shell_scripts/cache-stack.sh down

# Start/stop MongoDB stack
./tools/shell_scripts/mongo-stack.sh up
./tools/shell_scripts/mongo-stack.sh down
```

## Infrastructure Best Practices

1. **Data Persistence**

   - Use named volumes for data storage
   - Configure appropriate backup strategies
   - Monitor disk usage

2. **Security**

   - Change default passwords
   - Use environment variables for secrets
   - Configure proper network isolation

3. **Resource Management**

   - Set appropriate memory limits
   - Monitor container health
   - Scale services as needed

4. **Development Workflow**
   - Use consistent port mappings
   - Maintain documentation
   - Version control configurations
