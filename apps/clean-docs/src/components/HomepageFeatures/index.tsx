import Heading from '@theme/Heading';
import classNames from 'classnames';
import React, { JSX, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

type FeatureCategory = 'all' | 'architecture' | 'development' | 'features';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: string;
  link: string;
  category: FeatureCategory[];
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Monorepo Structure',
    Svg: require('@site/static/img/monorepo.svg').default,
    description: 'Efficiently organize and scale your projects using Nx for monorepo management.',
    link: '/docs/getting-started/project-structure',
    category: ['architecture'],
  },
  {
    title: 'TypeScript Everywhere',
    Svg: require('@site/static/img/typescript.svg').default,
    description: 'Leverage the power of static typing across the entire stack for better code quality and maintainability.',
    link: '/docs/architecture/philosophy',
    category: ['development'],
  },
  {
    title: 'Microservices Architecture',
    Svg: require('@site/static/img/microservices.svg').default,
    description: 'Build scalable applications with a distributed system of loosely coupled services.',
    link: '/docs/architecture/philosophy',
    category: ['architecture'],
  },
  {
    title: 'Observability',
    Svg: require('@site/static/img/observability.svg').default,
    description: 'Complete observability stack with Open Telemetry, Prometheus, Grafana, Loki, and Tempo.',
    link: '/docs/platform-features/observability/what-is-otel',
    category: ['features'],
  },
  {
    title: 'Rate Limiting',
    Svg: require('@site/static/img/rate_limit.svg').default,
    description: 'Implement robust rate limiting strategies to manage API traffic and enhance security.',
    link: '/docs/platform-features/rate-limiter',
    category: ['features'],
  },
  {
    title: 'Cache Management',
    Svg: require('@site/static/img/cache.svg').default,
    description: 'Modular cache management with support for Redis and other cache stores.',
    link: '/docs/platform-features/caching',
    category: ['features'],
  },
  {
    title: 'Code Quality',
    Svg: require('@site/static/img/quality.svg').default,
    description: 'Enforced through ESLint, Prettier, and TypeScript to ensure high-quality code.',
    link: '/docs/architecture/philosophy',
    category: ['development'],
  },
  {
    title: 'gRPC Communication',
    Svg: require('@site/static/img/microservices.svg').default,
    description: 'Efficient service-to-service communication with gRPC for high-performance APIs.',
    link: '/docs/framework/components',
    category: ['architecture'],
  },
  {
    title: 'Developer Experience',
    Svg: require('@site/static/img/quality.svg').default,
    description: 'Enhanced DX with hot reloading, dependency management, and consistent tooling.',
    link: '/docs/getting-started/quick-start',
    category: ['development'],
  },
];

function Feature({ title, Svg, description, link }: Omit<FeatureItem, 'category'>) {
  return (
    <div
      className={styles.feature}
      role="article">
      <div className={styles.featureHeader}>
        <Svg
          className={styles.featureSvg}
          role="img"
          aria-hidden="true"
        />
        <Heading as="h3">{title}</Heading>
      </div>
      <p>{description}</p>
      <Link
        to={link}
        className="button button--link"
        aria-label={`Learn more about ${title}`}>
        Learn more <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<FeatureCategory>('all');

  const categories = [
    { id: 'all', label: 'All Features' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'development', label: 'Development' },
    { id: 'features', label: 'Platform Features' },
  ];

  const filteredFeatures = activeCategory === 'all' ? FeatureList : FeatureList.filter(feature => feature.category.includes(activeCategory as FeatureCategory));

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.featuresTabs}>
          {categories.map(category => (
            <button
              key={category.id}
              className={classNames(styles.categoryTab, {
                [styles.categoryTabActive]: activeCategory === category.id,
              })}
              onClick={() => setActiveCategory(category.id as FeatureCategory)}
              aria-pressed={activeCategory === category.id}>
              {category.label}
            </button>
          ))}
        </div>

        <div className={styles.features}>
          {filteredFeatures.map((props, idx) => (
            <Feature
              key={idx}
              title={props.title}
              Svg={props.Svg}
              description={props.description}
              link={props.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
