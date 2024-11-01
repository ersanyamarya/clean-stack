import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import React from 'react';
import styles from './index.module.css';

const HeroLogo = require('@site/static/img/logo.svg').default;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <div className={styles.logoWrapper}>
            <HeroLogo
              className={styles.logoSvg}
              aria-hidden="true"
            />
          </div>
          <Heading
            as="h1"
            className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className={styles.buttonContainer}>
            <Link
              className={styles.getStarted}
              to="/docs">
              Get Started →
            </Link>
          </div>
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
      <main className={styles.main}>
        <div className={styles.section}>
          <Heading
            as="h2"
            className={styles.sectionTitle}>
            Features
          </Heading>
          <p className={styles.sectionSubtitle}>What makes Clean Stack special?</p>
        </div>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
