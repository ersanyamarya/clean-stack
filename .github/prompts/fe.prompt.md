# Frontend Development Guide

This guide covers frontend development practices, component library usage, and setup instructions for the Clean Stack monorepo.

## Technology Stack

- **TypeScript**: Used exclusively for all frontend development
- **React**: Core UI library
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Component library based on Radix UI and Tailwind CSS
- **lucide-react**: Icon library for React
- **TanStack Router**: Type-safe routing solution
- **i18next**: Internationalization framework
- **Vite**: Build tool and development server

## Component Library and Design System

Our shared component library is located in `frontend-libs/components`. It contains:

- Pre-built UI components using shadcn/ui
- Global styles and Tailwind configuration
- Shared hooks and utilities

### Adding New shadcn/ui Components

To add new shadcn/ui components to the shared library:

```bash
bun run shadcn:add <component-name>
```

This will add the component to `frontend-libs/components/src/ui/`. The components are automatically available to all frontend applications through the package `@clean-stack/components`.

### Using Components

Import components from the shared library:

```tsx
import { Button } from '@clean-stack/components/button';
import { Card } from '@clean-stack/components/card';
```

## Styling and Tailwind Configuration

### Base Configuration

The main Tailwind configuration is in `frontend-libs/components/tailwind.config.js`. This serves as the base configuration for all frontend applications and includes:

- Custom colors and theme variables
- Shared component styles
- Global utility classes

```js
// frontend-libs/components/tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      // Theme configuration (colors, spacing, etc.)
    }
  }
};
```

### Project-Specific Configuration

For a new frontend project, extend the base configuration:

```js
// apps/your-app/tailwind.config.js
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const TailwindConfig = require('../../frontend-libs/components/tailwind.config');
const { join } = require('path');

module.exports = {
  ...TailwindConfig,
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    ...TailwindConfig.content,
  ],
};
```

## Global Styles

Global styles are managed in `frontend-libs/components/src/styles/global.css`. This includes:

- Base Tailwind directives
- CSS variables for theming
- Global component styles

Import the global styles in your application's entry point:

```tsx
import '@clean-stack/styles/global.css';
```

## Best Practices

1. **Component Organization**
   - Place reusable components in the shared library
   - Keep application-specific components in the app's components folder
   - Use atomic design principles (atoms, molecules, organisms)

2. **State Management**
   - Use React Query for server state
   - Use Zustand for client state
   - Keep state close to where it's used

3. **Code Style**
   - Follow TypeScript best practices
   - Use absolute imports
   - Maintain consistent component patterns

4. **Performance**
   - Lazy load routes and heavy components
   - Use proper image optimization
   - Implement proper code splitting

## Directory Structure for Frontend Apps

```
apps/your-app/
├── src/
│   ├── widgets/        # App-specific components
│   ├── hooks/            # Custom hooks
│   ├── routes/           # Route components
│   ├── utils/            # Utility functions
│   ├── styles/           # App-specific styles
│   ├── main.tsx         # Entry point
│   └── app.tsx          # Root component
```

## Shared Frontend Libraries

- **@clean-stack/components**: UI components and design system
- **@clean-stack/fe-utils**: Frontend utilities and hooks
- **@clean-stack/frontend-telemetry**: Client-side monitoring

## Adding New Features

1. **First, check if the component exists in the shared library**
2. **If not, determine if it should be:**
   - Added to the shared library (if reusable)
   - Created as an app-specific component

3. **For adding shadcn components:**
```bash
bun run shadcn:add component-name  # For shadcn/ui components
```

4. **For app-specific components:**
   - Create in the app's widgets directory
   - Follow the established patterns and styles

## Troubleshooting

### Common Issues

1. **Styles not applying:**
   - Check tailwind.config.js content paths
   - Verify global.css import
   - Clear .nx cache: `nx clear-cache`

2. **Component not found:**
   - Check import path
   - Verify component is exported
   - Run `nx build components`

3. **Type errors:**
   - Update TypeScript version
   - Check @clean-stack/* package versions
   - Rebuild the project: `nx build your-app`
