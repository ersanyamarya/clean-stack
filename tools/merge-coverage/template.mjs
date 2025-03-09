import fs from 'fs';

// Read custom.css to extract color variables
const customCssPath = 'apps/clean-docs/src/css/custom.css';
const customCss = fs.readFileSync(customCssPath, 'utf8');

const sharedStyles = /* css */ `
  :root {
    ${customCss.match(/:root\s*{([^}]*)}/)[1]}

    /* Layout */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;

    /* Colors */
    --surface-1: #ffffff;
    --surface-2: #f3f4f6;
    --surface-3: #e5e7eb;

    /* Coverage Colors - Darker & More Accessible */
    --color-success: #059669;
    --color-warning: #d97706;
    --color-error: #dc2626;
    --color-success-bg: #dcfce7;
    --color-warning-bg: #fef3c7;
    --color-error-bg: #fee2e2;
    --color-success-border: #6ee7b7;
    --color-warning-border: #fcd34d;
    --color-error-border: #fca5a5;

    /* Typography */
    --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-sans);
    background: var(--surface-2);
    color: var(--ifm-color-emphasis-800);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  .header {
    background: var(--ifm-color-primary);
    padding: var(--spacing-xl) var(--spacing-lg);
    color: white;
    margin-bottom: var(--spacing-2xl);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 1rem;
    opacity: 0.9;
  }

  .nav-links {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }

  .nav-link {
    color: inherit;
    text-decoration: none;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.15);
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .metric {
    padding: var(--spacing-md);
    border-radius: 8px;
    background: var(--surface-1);
    border: 1px solid var(--surface-3);
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  .coverage-high {
    background: var(--color-success-bg);
    border-color: var(--color-success-border);
    color: var(--color-success);
    font-weight: 600;
  }

  .coverage-medium {
    background: var(--color-warning-bg);
    border-color: var(--color-warning-border);
    color: var(--color-warning);
    font-weight: 600;
  }

  .coverage-low {
    background: var (--color-error-bg);
    border-color: var(--color-error-border);
    color: var(--color-error);
    font-weight: 600;
  }
`;

const indexStyles = /* css */ `
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-2xl);
  }

  .card {
    background: var(--surface-1);
    border-radius: 12px;
    border: 1px solid var(--surface-3);
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .card-header {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--surface-3);
    background: var(--surface-2);
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--ifm-color-primary);
  }

  .card-content {
    padding: var(--spacing-lg);
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .metric {
    text-align: center;
  }

  .metric-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ifm-color-emphasis-700);
    margin-bottom: var(--spacing-xs);
  }

  .metric-value {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1;
  }

  .card-footer {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--surface-2);
    border-top: 1px solid var(--surface-3);
  }

  .overall-metrics {
    background: var(--surface-1);
    border-radius: 12px;
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);
    border: 1px solid var(--surface-3);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  .overall-metrics h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: var(--spacing-lg);
    color: var(--ifm-color-emphasis-900);
  }

  .category-section {
    margin-bottom: var(--spacing-2xl);
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }

  .category-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ifm-color-emphasis-900);
  }
`;

const detailStyles = /* css */ `
  .breadcrumb {
    background: var(--surface-1);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: 8px;
    margin-bottom: var(--spacing-xl);
    border: 1px solid var(--surface-3);
    font-size: 0.875rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
  }

  .table-container {
    background: var(--surface-1);
    border-radius: 12px;
    border: 1px solid var(--surface-3);
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ifm-color-emphasis-800);
    background: var(--surface-2);
    padding: var(--spacing-md) var(--spacing-lg);
    text-align: left;
    border-bottom: 1px solid var(--surface-3);
  }

  td {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--surface-3);
    font-size: 0.875rem;
    font-weight: 500;
  }

  tr:hover {
    background: var(--surface-2);
  }

  tr:last-child td {
    border-bottom: none;
  }

  .file-path {
    font-family: var(--font-mono);
    color: var(--ifm-color-emphasis-900);
  }
`;

function getCoverageClass(coverage) {
  const value = parseFloat(coverage);
  if (value >= 80) return 'coverage-high';
  if (value >= 50) return 'coverage-medium';
  return 'coverage-low';
}

function generateOverviewHtml(projectCoverage, getPercentage, overallMetrics) {
  return /* html */ `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coverage Overview</title>
  <style>
    ${sharedStyles}
    ${indexStyles}
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <h1 class="title">Coverage Overview</h1>
      <p class="subtitle">Test coverage report by category and project</p>
      <nav class="nav-links">
        <a href="nyc/index.html" class="nav-link">Standard NYC Report</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="overall-metrics">
      <h2>Overall Coverage</h2>
      <div class="metric-grid">
        <div class="metric ${getCoverageClass(overallMetrics.statements)}">
          <div class="metric-label">Statements</div>
          <div class="metric-value">${overallMetrics.statements}%</div>
        </div>
        <div class="metric ${getCoverageClass(overallMetrics.branches)}">
          <div class="metric-label">Branches</div>
          <div class="metric-value">${overallMetrics.branches}%</div>
        </div>
        <div class="metric ${getCoverageClass(overallMetrics.functions)}">
          <div class="metric-label">Functions</div>
          <div class="metric-value">${overallMetrics.functions}%</div>
        </div>
        <div class="metric ${getCoverageClass(overallMetrics.lines)}">
          <div class="metric-label">Lines</div>
          <div class="metric-value">${overallMetrics.lines}%</div>
        </div>
      </div>
    </section>

    ${Object.entries(projectCoverage)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([category, data]) => `
        <section class="category-section">
          <div class="category-header">
            <h2 class="category-title">${category}</h2>
            <div class="metric ${getCoverageClass(getPercentage(data.summary.statements))}">
              ${getPercentage(data.summary.statements)}% statements covered
            </div>
          </div>

          <div class="card-grid">
            ${Object.entries(data.projects)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([project, projectData]) => {
                const metrics = {
                  statements: getPercentage(projectData.summary.statements),
                  branches: getPercentage(projectData.summary.branches),
                  functions: getPercentage(projectData.summary.functions),
                  lines: getPercentage(projectData.summary.lines),
                };

                return /* html */ `
                  <article class="card">
                    <header class="card-header">
                      <h3 class="card-title">${project}</h3>
                    </header>
                    <div class="card-content">
                      <div class="metric-grid">
                        <div class="metric ${getCoverageClass(metrics.statements)}">
                          <div class="metric-label">Statements</div>
                          <div class="metric-value">${metrics.statements}%</div>
                        </div>
                        <div class="metric ${getCoverageClass(metrics.branches)}">
                          <div class="metric-label">Branches</div>
                          <div class="metric-value">${metrics.branches}%</div>
                        </div>
                        <div class="metric ${getCoverageClass(metrics.functions)}">
                          <div class="metric-label">Functions</div>
                          <div class="metric-value">${metrics.functions}%</div>
                        </div>
                        <div class="metric ${getCoverageClass(metrics.lines)}">
                          <div class="metric-label">Lines</div>
                          <div class="metric-value">${metrics.lines}%</div>
                        </div>
                      </div>
                    </div>
                    <footer class="card-footer">
                      <a href="${category}-${project}.html" class="nav-link">View Details (${projectData.fileCount} files)</a>
                    </footer>
                  </article>
                `;
              })
              .join('')}
          </div>
        </section>
      `
      )
      .join('')}
  </main>
</body>
</html>`;
}

function generateDetailHtml(category, project, data, metrics, getPercentage) {
  return /* html */ `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coverage: ${category}/${project}</title>
  <style>
    ${sharedStyles}
    ${detailStyles}
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <nav class="nav-links">
        <a href="index.html" class="nav-link">← Back to Overview</a>
        <a href="nyc/index.html" class="nav-link">Standard NYC Report</a>
      </nav>

      <div class="breadcrumb">
        <span>${category}</span>
        <span>/</span>
        <strong>${project}</strong>
      </div>
    </div>
  </header>

  <main class="container">
    <section class="summary-grid">
      <div class="metric ${getCoverageClass(metrics.statements)}">
        <div class="metric-label">Statements</div>
        <div class="metric-value">${metrics.statements}%</div>
      </div>
      <div class="metric ${getCoverageClass(metrics.branches)}">
        <div class="metric-label">Branches</div>
        <div class="metric-value">${metrics.branches}%</div>
      </div>
      <div class="metric ${getCoverageClass(metrics.functions)}">
        <div class="metric-label">Functions</div>
        <div class="metric-value">${metrics.functions}%</div>
      </div>
      <div class="metric ${getCoverageClass(metrics.lines)}">
        <div class="metric-label">Lines</div>
        <div class="metric-value">${metrics.lines}%</div>
      </div>
    </section>

    <section class="table-container">
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Statements</th>
            <th>Branches</th>
            <th>Functions</th>
            <th>Lines</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(data.files)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(
              ([file, metrics]) => `
              <tr>
                <td class="file-path">${file}</td>
                <td class="${getCoverageClass(getPercentage(metrics.statements))}">
                  ${getPercentage(metrics.statements)}%
                </td>
                <td class="${getCoverageClass(getPercentage(metrics.branches))}">
                  ${getPercentage(metrics.branches)}%
                </td>
                <td class="${getCoverageClass(getPercentage(metrics.functions))}">
                  ${getPercentage(metrics.functions)}%
                </td>
                <td class="${getCoverageClass(getPercentage(metrics.lines))}">
                  ${getPercentage(metrics.lines)}%
                </td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>`;
}

// Convert CommonJS exports to ES module exports
export { generateDetailHtml, generateOverviewHtml, getCoverageClass };
