import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import React from 'react';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading
          as="h1"
          className="hero__title">
          {siteConfig.title} Documentation
        </Heading>
        <p className="hero__subtitle">Your go-to resource for mastering our platform.</p>
        <p className="hero__description">
          Explore comprehensive guides and tutorials to help you get the most out of our platform. Whether you're a beginner or an expert, you'll find valuable
          insights here.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Learning
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/overview">
            Explore Features
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title} Documentation`}
      description="Explore our comprehensive documentation to get started and learn more about our platform.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
