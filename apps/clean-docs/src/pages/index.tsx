import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import React, { JSX } from 'react';
import styles from './index.module.css';

const HeroLogo = require('@site/static/img/logo.svg').default;
const GithubIcon = require('@site/static/img/github.svg').default;

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
            <Link
              className={styles.secondaryButton}
              href="https://github.com/ersanyamarya/clean-stack"
              target="_blank"
              rel="noopener noreferrer">
              <GithubIcon className={styles.buttonIcon} /> View on GitHub
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.codePreviewWrapper}>
            <div className={styles.codePreview}>
              <div className={styles.codeDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className={styles.codeContent}>
                <pre>
                  <code>
                    <span className={styles.codeComment}>// Modern TypeScript stack for scalable apps</span>
                    <br />
                    <span className={styles.codeKeyword}>import</span> {'{'}
                    <br />
                    <span className={styles.codeSpaces}></span>microservices,
                    <br />
                    <span className={styles.codeSpaces}></span>observability,
                    <br />
                    <span className={styles.codeSpaces}></span>caching,
                    <br />
                    <span className={styles.codeSpaces}></span>rateLimiter,
                    <br />
                    {'}'} <span className={styles.codeKeyword}>from</span> <span className={styles.codeString}>'clean-stack'</span>;
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatsSection() {
  return (
    <div className={styles.statsSection}>
      <div className={styles.statsInner}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>100%</span>
          <span className={styles.statLabel}>TypeScript</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>20+</span>
          <span className={styles.statLabel}>Libraries</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>0</span>
          <span className={styles.statLabel}>Config Hassle</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>∞</span>
          <span className={styles.statLabel}>Scalability</span>
        </div>
      </div>
    </div>
  );
}

function QuickStartSection() {
  return (
    <div className={styles.quickStartSection}>
      <div className={styles.container}>
        <Heading
          as="h2"
          className={styles.sectionTitle}>
          Quick Start
        </Heading>
        <p className={styles.sectionSubtitle}>Get up and running in minutes with these simple steps</p>

        <div className={styles.quickStartSteps}>
          <div className={styles.quickStartStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Clone the Repository</h3>
              <div className={styles.codeSnippet}>
                <code>git clone https://github.com/ersanyamarya/clean-stack.git</code>
              </div>
            </div>
          </div>

          <div className={styles.quickStartStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Install Dependencies</h3>
              <div className={styles.codeSnippet}>
                <code>cd clean-stack && bun install</code>
              </div>
            </div>
          </div>

          <div className={styles.quickStartStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Start Development</h3>
              <div className={styles.codeSnippet}>
                <code>bun run platform:all</code>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.quickStartCta}>
          <Link
            to="/docs/getting-started/installation"
            className={styles.outlinedButton}>
            View Full Installation Guide
          </Link>
        </div>
      </div>
    </div>
  );
}

function CtaSection() {
  return (
    <div className={styles.ctaSection}>
      <div className={styles.container}>
        <Heading as="h2">Ready to Build Something Amazing?</Heading>
        <p>Clean Stack provides everything you need to build robust, scalable applications</p>
        <div className={styles.ctaButtons}>
          <Link
            to="/docs"
            className={styles.getStarted}>
            Explore Docs
          </Link>
          <Link
            href="https://github.com/ersanyamarya/clean-stack"
            className={styles.outlinedButton}>
            View Examples
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <StatsSection />
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
        <QuickStartSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
