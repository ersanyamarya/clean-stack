import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
        title: 'Getting Started with Clean Stack',
        description: 'Learn how to get started with Clean Stack quickly and efficiently.',
        slug: '/category/getting-started',
      },
      items: ['getting-started/quick-start', 'getting-started/installation', 'getting-started/project-structure'],
    },
    {
      type: 'category',
      label: 'Architecture',
      link: {
        type: 'generated-index',
        title: 'Clean Stack Architecture',
        description: 'Understand the architectural principles and design decisions behind Clean Stack.',
        slug: '/category/architecture',
      },
      items: ['architecture/philosophy'],
    },
    {
      type: 'category',
      label: 'Platform Features',
      link: {
        type: 'doc',
        id: 'platform-features/index',
      },
      items: [
        {
          type: 'category',
          label: 'Observability',
          link: {
            type: 'doc',
            id: 'platform-features/observability/index',
          },
          items: [
            'platform-features/observability/what-is-otel',
            'platform-features/observability/otel-clean-stack',
            'platform-features/observability/grafana-stack',
            'platform-features/observability/exporters',
            'platform-features/observability/advanced',
          ],
        },
        'platform-features/caching',
        'platform-features/rate-limiter',
        'platform-features/implementation',
        'platform-features/infrastructure',
        'platform-features/telemetry',
      ],
    },
    {
      type: 'category',
      label: 'Framework',
      link: {
        type: 'generated-index',
        title: 'Framework Components',
        description: 'Core framework components and utilities that power Clean Stack.',
        slug: '/category/framework',
      },
      items: ['framework/components'],
    },
  ],
};

export default sidebars;
