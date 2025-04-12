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
          items: ['platform-features/observability/otel-clean-stack', 'platform-features/observability/grafana-stack'],
        },
        'platform-features/caching',
        'platform-features/rate-limiter',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      link: {
        type: 'generated-index',
        title: 'API Reference',
        description: 'Detailed documentation of Clean Stack APIs and components.',
        slug: '/category/api-reference',
      },
      items: [],
    },
  ],
};

export default sidebars;
