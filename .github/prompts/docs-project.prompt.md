# Clean Docs Project Guide

The `clean-docs` project, located in the clean-docs directory, is a documentation website built using Docusaurus. It provides comprehensive documentation for the Clean Stack project.

### Key Configuration Files

- **docusaurus.config.ts**: This file is the main configuration file for the Docusaurus site. It defines the site's title, tagline, favicon, URL, and deployment settings. It also configures the theme, navbar, footer, and plugins.
- **sidebars.ts**: This file defines the structure of the sidebar navigation for the documentation. It specifies the order and hierarchy of the documentation pages.
- **babel.config.js**: This file configures Babel, a JavaScript compiler, for the Docusaurus site. It specifies the presets to use for transforming the JavaScript code.
- **blog/authors.yml**: This file contains information about the authors of the blog posts.
- **blog/tags.yml**: This file defines the tags used for the blog posts.

### Key CSS Files

- **src/css/custom.css**: This file contains custom CSS styles for the Docusaurus site. It defines the colors, fonts, and other visual elements of the site. It includes configurations for both light and dark themes.
- **src/pages/index.module.css**: This file contains CSS styles specific to the homepage of the Docusaurus site (`src/pages/index.tsx`). It defines the layout and appearance of the hero section, features section, and other elements on the homepage.
- **src/components/HomepageFeatures/styles.module.css**: This file contains CSS styles for the `HomepageFeatures` component, which is used to display the features of the Clean Stack project on the homepage.

### Documentation Files

The documentation files are located in the `docs` directory.

### Key Components

- **src/components/HomepageFeatures/index.tsx**: This component displays the features of the Clean Stack project on the homepage.
- **src/pages/index.tsx**: This file defines the homepage of the Docusaurus site. It includes the hero section, features section, and other elements.

This guide should provide a good overview of the `clean-docs` project and its key components.
