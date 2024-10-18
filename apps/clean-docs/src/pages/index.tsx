import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import React from 'react';
import styles from './index.module.css';

const HeroIMAGE = require('@site/static/img/logo.svg').default;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={styles.heroContainer}>
        <div className={styles.heroText}>
          <Heading
            as="h1"
            className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>

          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              Get Started
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <HeroIMAGE />
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <HomepageHeader />
      {/* <pre
        style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          position: 'absolute',
          top: '0',
          right: '0',
          overflow: 'auto',
          height: '100vh',
        }}>
        <code>{JSON.stringify(siteConfig, null, 2)}</code>
      </pre> */}
      <main>
        <section className={styles.customSection}>
          <h2>Features</h2>
          <p> What makes Clean Stack special?</p>
        </section>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
