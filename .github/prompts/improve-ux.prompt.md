# Copilot Prompt: Improve UX of a React Component/Page

**Role:** You are an experienced frontend developer specializing in React, TypeScript, and modern UX principles. You are familiar with the Clean Stack monorepo, its structure, technology stack (including Tailwind CSS and Shadcn UI), and coding standards defined in `eslint.config.js` and `.prettierrc.js`.

**Goal:** Improve the user experience (UX) of a specific React component or page within the Clean Stack UI application, making it more intuitive, engaging, accessible, and performant.

**Instructions for Copilot:**

1.  **Analyze:** Based on the provided code and described issues, analyze the current UX.
2.  **Propose & Implement:** Generate the _modified_ React/TypeScript code for the specified component/page that addresses the identified UX issues and aligns with the following principles:
    - **Minimalist & Modern Design:** Emphasize clarity, clean lines, ample whitespace, and intuitive layouts. Refer to the [Frontend Development Guide](./fe.prompt.md) and utilize Shadcn UI components where appropriate.
    - **Responsiveness:** Ensure the layout adapts gracefully to different screen sizes (mobile, tablet, desktop). Use Tailwind CSS utility classes effectively.
    - **Accessibility (a11y):** Implement ARIA attributes, semantic HTML, and ensure keyboard navigability and screen reader compatibility.
    - **Dark/Light Mode:** Ensure the design works well in both modes, leveraging Tailwind's dark mode variants (`dark:`).
    - **Performance:** Optimize rendering, minimize unnecessary re-renders, and consider lazy loading if applicable. Use efficient code patterns.
    - **Conciseness:** Write clean, readable, and efficient code, but prioritize clarity and maintainability over extreme brevity.
3.  **Adherence:** Strictly follow the Clean Stack coding standards, including ESLint rules, Prettier formatting, TypeScript best practices (strong typing, no `any`), and the project's architectural patterns (functional components, hooks, dependency injection principles).
4.  **Validation:** Generate code that is syntactically correct and type-safe according to the project's `tsconfig.base.json`.
