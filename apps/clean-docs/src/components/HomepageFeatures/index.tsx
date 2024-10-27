import Heading from '@theme/Heading';
import React from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: string;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Monorepo Structure',
    Svg: require('@site/static/img/monorepo.svg').default,
    description: 'Efficiently organize and scale your projects using Nx for monorepo management.',
    link: '/docs',
  },
  {
    title: 'TypeScript Everywhere',
    Svg: require('@site/static/img/typescript.svg').default,
    description: 'Leverage the power of static typing across the entire stack for better code quality and maintainability.',
    link: '/docs',
  },
  {
    title: 'Microservices Architecture',
    Svg: require('@site/static/img/microservices.svg').default,
    description: 'Build scalable applications with a distributed system of loosely coupled services.',
    link: '/docs',
  },
  {
    title: 'Observability',
    Svg: require('@site/static/img/observability.svg').default,
    description: 'Observability stack with Open Telemetry, Prometheus, Grafana, Loki, and Tempo.',
    link: '/docs/platform-features/observability',
  },
  {
    title: 'Rate Limiting',
    Svg: require('@site/static/img/rate_limit.svg').default,
    description: 'Implement robust rate limiting strategies to manage API traffic and enhance security.',
    link: '/docs/platform-features/rate-limiter',
  },

  {
    title: 'Cache Management',
    Svg: require('@site/static/img/cache.svg').default,
    description: 'Modular cache management with support for Redis and other cache stores.',
    link: '/docs/platform-features/caching',
  },
  {
    title: 'Code Quality',
    Svg: require('@site/static/img/quality.svg').default,
    description: 'Enforced through ESLint, Prettier, and TypeScript to ensure high-quality code.',
    link: '/docs',
  },
];

function Feature({ title, Svg, description, link }: FeatureItem) {
  return (
    <div className={styles.feature}>
      <div>
        <Svg
          className={styles.featureSvg}
          role="img"
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
      <span style={{ flex: 1 }} />
      <a
        className="button button--secondary button--lg"
        href={link}>
        Learn more
      </a>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <div className="container">
      <section className={styles.features}>
        {FeatureList.map((props, idx) => (
          <Feature
            key={idx}
            {...props}
          />
        ))}
      </section>
    </div>
  );
}
