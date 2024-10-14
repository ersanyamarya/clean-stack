import Heading from '@theme/Heading';
import clsx from 'clsx';
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
    title: 'Rate Limiting',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: 'Implement robust rate limiting strategies to manage API traffic and enhance security.',
    link: '/docs/rate-limiter',
  },
  {
    title: 'Microservices Architecture',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: 'Build scalable applications with a distributed system of loosely coupled services.',
    link: '/docs/microservices',
  },
  {
    title: 'Observability',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: 'Observability stack with Open Telemetry, Prometheus, Grafana, Loki, and Tempo.',
    link: '/docs/observability',
  },
  {
    title: 'Monorepo Structure',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: 'Efficiently organize and scale your projects using Nx for monorepo management.',
    link: '/docs/monorepo',
  },
  {
    title: 'TypeScript Everywhere',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: 'Leverage the power of static typing across the entire stack for better code quality and maintainability.',
    link: '/docs/typescript',
  },
  {
    title: 'Cache Management',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: 'Modular cache management with support for Redis and other cache stores.',
    link: '/docs/cache',
  },
  {
    title: 'Code Quality',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: 'Enforced through ESLint, Prettier, and TypeScript to ensure high-quality code.',
    link: '/docs/code-quality',
  },
];

function Feature({ title, Svg, description, link }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg
          className={styles.featureSvg}
          role="img"
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <a
          href={link}
          className={styles.learnMoreButton}>
          Learn more
        </a>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature
              key={idx}
              {...props}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
