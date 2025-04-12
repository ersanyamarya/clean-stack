# Clean Docs Project Guide (AI Instructions)

**Purpose:** Use this guide to understand the structure, key files, and specific conventions when modifying or generating content for the `clean-docs` project (`apps/clean-docs`). Adhere to the general monorepo guidelines alongside these project-specific instructions.

The `clean-docs` project is a documentation website built using Docusaurus, located in `apps/clean-docs`.

### Key Configuration Files & Common Modifications

- **docusaurus.config.ts**: Main Docusaurus configuration. Modifications might involve updating site metadata (title, URL), theme settings, navbar/footer links, or managing Docusaurus plugins (like `theme-mermaid` or `docusaurus-plugin-typedoc` for integrating generated API docs).
- **sidebars.ts**: Defines the documentation sidebar structure. Modifications typically involve adding new documentation pages/sections or reordering existing ones. Ensure the structure remains logical and follows the hierarchy of the documented features.
- **babel.config.js**: Babel configuration. Usually requires no changes unless dependency updates necessitate configuration adjustments.
- **blog/authors.yml**: Author information for blog posts. Modifications involve adding/updating author details.
- **blog/tags.yml**: Tag definitions for blog posts. Modifications involve adding/updating tags.

### Key CSS Files & Styling Conventions

- **src/css/custom.css**: Global custom styles, including light/dark theme variables. Modifications should align with the existing theme structure. Prefer using CSS variables defined here.
- **src/pages/index.module.css**: CSS Modules specific to the homepage (`src/pages/index.tsx`). Scope styles locally using CSS Modules.
- **src/components/HomepageFeatures/styles.module.css**: CSS Modules for the `HomepageFeatures` component. Scope styles locally using CSS Modules.

### Documentation Content (`docs/` directory)

- Documentation files are written in Markdown (`.md` or `.mdx`).
- When adding new documentation, ensure it is linked correctly in `sidebars.ts`.
- Maintain a clear and consistent writing style.
- Use Mermaid diagrams for flowcharts or sequence diagrams where appropriate (enabled via `theme-mermaid`).
- Link to generated API documentation (managed via `docusaurus-plugin-typedoc` and configured in `docusaurus.config.ts`) where relevant.

### Key React Components

- **src/components/HomepageFeatures/index.tsx**: Displays feature cards on the homepage. Modifications might involve changing the content or layout of these features.
- **src/pages/index.tsx**: The main homepage component. Modifications might involve changing the hero section, integrating new components, or adjusting the overall page structure.

### AI Task Guidelines for `clean-docs`

1.  **Adding/Updating Docs:** When asked to add documentation, create Markdown files in the `docs/` directory and update `sidebars.ts` accordingly.
2.  **Configuration Changes:** Modify `docusaurus.config.ts` for site-level settings or plugin configurations.
3.  **Styling:** Use CSS Modules for component-specific styles (`*.module.css`) and `src/css/custom.css` for global theme adjustments.
4.  **Component Logic:** Modify React components in `src/components/` or `src/pages/` as requested, ensuring adherence to React best practices.
5.  **Integration:** Ensure changes related to API documentation correctly reference the TypeDoc generation process and configuration.
