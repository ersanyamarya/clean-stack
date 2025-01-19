import fs from 'fs';

// Read custom.css to extract color variables
const customCssPath = 'apps/clean-docs/src/css/custom.css';
const customCss = fs.readFileSync(customCssPath, 'utf8');

const sharedStyles = `
  :root {
    ${customCss.match(/:root\s*{([^}]*)}/)[1]}

    /* Layout */
    --spacing-xs: 0.5rem;
    --spacing-sm: 0.75rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);

    /* Border Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;

    /* Coverage Colors - Updated for better accessibility */
    --color-success: #15803d;
    --color-warning: #854d0e;
    --color-error: #991b1b;
    --color-success-bg: #dcfce7;
    --color-warning-bg: #fef9c3;
    --color-error-bg: #fee2e2;
    --color-success-border: #86efac;
    --color-warning-border: #fde047;
    --color-error-border: #fecaca;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: var(--spacing-xl);
    background: #f8fafc;
    color: var(--ifm-color-emphasis-700);
    line-height: 1.5;
  }

  .header {
    background: var(--ifm-color-primary);
    margin: calc(-1 * var(--spacing-xl)) calc(-1 * var(--spacing-xl)) var(--spacing-xl) calc(-1 * var(--spacing-xl));
    padding: var(--spacing-2xl) var(--spacing-xl);
    color: white;
    box-shadow: var(--shadow-lg);
  }

  .header .nav-links {
    margin-top: var(--spacing-lg);
    margin-bottom: 0;
  }

  .header .nav-link {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .header .nav-link:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    letter-spacing: -0.025em;
  }

  .subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
  }

  .nav-links {
    margin-bottom: var(--spacing-xl);
    display: flex;
    gap: var(--spacing-md);
  }

  .nav-link {
    color: var(--ifm-color-primary);
    text-decoration: none;
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var (--radius-sm);
    background: white;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;
    font-weight: 500;
  }

  .nav-link:hover {
    background: var(--ifm-color-primary);
    color: white;
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .metric {
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    background: white;
    box-shadow: var(--shadow-sm);
    border: 1px solid transparent;
  }

  .coverage-high {
    background: var(--color-success-bg);
    color: var(--color-success);
    border-color: var(--color-success-border);
  }

  .coverage-medium {
    background: var(--color-warning-bg);
    color: var(--color-warning);
    border-color: var(--color-warning-border);
  }

  .coverage-low {
    background: var(--color-error-bg);
    color: var(--color-error);
    border-color: var(--color-error-border);
  }
`;

const indexStyles = `
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-xl);
  }

  .card {
    border-radius: var(--radius-md);
    padding: var(--spacing-xl);
    background: var(--ifm-background-surface-color);
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;
    border: 1px solid #e2e8f0;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--ifm-color-primary);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid #f1f5f9;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-md);
    background: #f8fafc;
    border-radius: var(--radius-sm);
  }

  .metric-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748b;
    margin-bottom: var(--spacing-xs);
  }

  .metric-value {
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: var(--spacing-xs);
    line-height: 1;
  }

  .metric {
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.2s ease;
  }

  .metric:hover {
    transform: translateY(-2px);
  }

  .category-section {
    margin-bottom: var(--spacing-2xl);
    padding: var(--spacing-lg);
    background: white;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }

  .category-title {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: var(--spacing-xl);
    color: var(--ifm-heading-color);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid #e2e8f0;
  }

  .category-summary {
    margin-bottom: var(--spacing-xl);
  }

  .overall-coverage {
    margin-bottom: var(--spacing-xl);
  }

  .overall-coverage .metric-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-lg);
  }
`;

const detailStyles = `
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--ifm-color-emphasis-700);
    margin-bottom: var(--spacing-xl);
    font-size: 1.125rem;
    padding: var(--spacing-md) var(--spacing-lg);
    background: white;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-2xl);
  }

  .summary-card {
    background: white;
    border-radius: var (--radius-md);
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .summary-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .summary-card .metric-label {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #475569;
    margin-bottom: var(--spacing-xs);
  }

  .summary-card .metric-value {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
  }

  .summary-card.coverage-high {
    background: var(--color-success-bg);
    border-color: var(--color-success-border);
  }

  .summary-card.coverage-medium {
    background: var(--color-warning-bg);
    border-color: var(--color-warning-border);
  }

  .summary-card.coverage-low {
    background: var(--color-error-bg);
    border-color: var(--color-error-border);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border: 1px solid #e2e8f0;
  }

  th, td {
    padding: var(--spacing-md) var(--spacing-lg);
    border: 1px solid #e2e8f0;
    text-align: left;
  }

  th {
    background: var(--ifm-color-primary);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.875rem;
  }

  tr:nth-child(even) {
    background-color: #f8fafc;
  }

  .file-path {
    font-family: ui-monospace, monospace;
    font-size: 0.875rem;
    color: #475569;
  }
`;

function getCoverageClass(coverage) {
  const value = parseFloat(coverage);
  if (value >= 80) return 'coverage-high';
  if (value >= 50) return 'coverage-medium';
  return 'coverage-low';
}

function generateOverviewHtml(projectCoverage, getPercentage, overallMetrics) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Coverage Overview</title>
  <style>
    ${sharedStyles}
    ${indexStyles}
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Coverage Overview</div>
    <div class="subtitle">Coverage report by category and project</div>
    <div class="nav-links">
      <a href="nyc/index.html" class="nav-link">Standard NYC Report</a>
    </div>
  </div>

  <div class="overall-coverage">
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
  </div>

  ${Object.entries(projectCoverage)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([category, data]) => `
      <div class="category-section">
        <h2 class="category-title">${category}</h2>
        <div class="category-summary">
          <div class="metric ${getCoverageClass(getPercentage(data.summary.statements))}">
            Overall: ${getPercentage(data.summary.statements)}% statements
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

              return `
                <div class="card">
                  <div class="card-title">${project}</div>
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
                  <div style="margin-top: 1rem; text-align: center;">
                    <a href="${category}-${project}.html" class="nav-link">View Details (${projectData.fileCount} files)</a>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `
    )
    .join('')}

</body>
</html>`;
}

function generateDetailHtml(category, project, data, metrics, getPercentage) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Coverage: ${category}/${project}</title>
  <style>
    ${sharedStyles}
    ${detailStyles}
  </style>
</head>
<body>
  <div class="nav-links">
    <a href="index.html" class="nav-link">← Back to Overview</a>
    <a href="nyc/index.html" class="nav-link">Standard NYC Report</a>
  </div>

  <div class="breadcrumb">
    <span>${category}</span>
    <span>/</span>
    <strong>${project}</strong>
  </div>

  <div class="summary-grid">
    <div class="summary-card ${getCoverageClass(metrics.statements)}">
      <div class="metric-label">Statements</div>
      <div class="metric-value">${metrics.statements}%</div>
    </div>
    <div class="summary-card ${getCoverageClass(metrics.branches)}">
      <div class="metric-label">Branches</div>
      <div class="metric-value">${metrics.branches}%</div>
    </div>
    <div class="summary-card ${getCoverageClass(metrics.functions)}">
      <div class="metric-label">Functions</div>
      <div class="metric-value">${metrics.functions}%</div>
    </div>
    <div class="summary-card ${getCoverageClass(metrics.lines)}">
      <div class="metric-label">Lines</div>
      <div class="metric-value">${metrics.lines}%</div>
    </div>
  </div>

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
</body>
</html>`;
}

// Convert CommonJS exports to ES module exports
export { generateDetailHtml, generateOverviewHtml, getCoverageClass };
