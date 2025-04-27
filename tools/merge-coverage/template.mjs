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
    --surface-2: #f9fafb;
    --surface-3: #f3f4f6;
    --surface-border: #e5e7eb;
    --text-primary: #111827;
    --text-secondary: #4b5563;
    --text-tertiary: #6b7280;

    /* Coverage Colors - Accessible & Modern */
    --color-success: #059669;
    --color-warning: #d97706;
    --color-error: #dc2626;
    --color-success-bg: #ecfdf5;
    --color-warning-bg: #fffbeb;
    --color-error-bg: #fef2f2;
    --color-success-border: #a7f3d0;
    --color-warning-border: #fcd34d;
    --color-error-border: #fca5a5;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

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
    color: var(--text-primary);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  .header {
    background: var(--ifm-color-primary);
    padding: var(--spacing-xl) var(--spacing-lg);
    color: white;
    margin-bottom: var(--spacing-2xl);
    box-shadow: var(--shadow-md);
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
    border: 1px solid var(--surface-border);
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
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
    background: var(--color-error-bg);
    border-color: var(--color-error-border);
    color: var(--color-error);
    font-weight: 600;
  }

  /* Search & Utility Styles */
  .search-container {
    position: relative;
    margin: var(--spacing-lg) 0;
  }

  .search-input {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg);
    padding-left: 2.75rem;
    background: var(--surface-1);
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--ifm-color-primary);
    box-shadow: 0 0 0 2px rgba(var(--ifm-color-primary-rgb), 0.1);
  }

  .search-icon {
    position: absolute;
    left: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    height: 16px;
    width: 16px;
  }

  .search-shortcut {
    position: absolute;
    right: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    font-size: 0.75rem;
    background: var(--surface-3);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .timestamp {
    color: var(--text-tertiary);
    font-size: 0.875rem;
    text-align: right;
    margin-bottom: var(--spacing-md);
  }

  .no-results {
    padding: var(--spacing-xl);
    text-align: center;
    color: var(--text-tertiary);
    background: var(--surface-1);
    border-radius: 8px;
    border: 1px solid var(--surface-border);
    margin-top: var(--spacing-lg);
    display: none;
  }

  @media (max-width: 768px) {
    .title {
      font-size: 1.5rem;
    }

    .subtitle {
      font-size: 0.875rem;
    }

    .container {
      padding: 0 var(--spacing-md);
    }
  }
`;

const indexStyles = /* css */ `
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-2xl);
  }

  .card {
    background: var(--surface-1);
    border-radius: 12px;
    border: 1px solid var(--surface-border);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .card-header {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--surface-border);
    background: var(--surface-2);
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--ifm-color-primary);
  }

  .card-content {
    padding: var(--spacing-lg);
    flex: 1;
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
    color: var(--text-tertiary);
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
    border-top: 1px solid var(--surface-border);
    margin-top: auto;
  }

  .overall-metrics {
    background: var(--surface-1);
    border-radius: 12px;
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);
    border: 1px solid var(--surface-border);
    box-shadow: var(--shadow-sm);
  }

  .overall-metrics h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: var(--spacing-lg);
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    color: var(--text-primary);
  }

  /* Filter & Toggle Components */
  .filters {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
  }

  .toggle-all {
    margin-left: auto;
    background: var(--surface-3);
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .toggle-all:hover {
    background: var(--surface-border);
  }
`;

const detailStyles = /* css */ `
  .breadcrumb {
    background: var(--surface-1);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: 8px;
    margin-bottom: var(--spacing-xl);
    border: 1px solid var(--surface-border);
    font-size: 0.875rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    align-items: center;
  }

  .breadcrumb-separator {
    margin: 0 var(--spacing-xs);
    color: var(--text-tertiary);
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
    border: 1px solid var(--surface-border);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
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
    color: var(--text-secondary);
    background: var(--surface-2);
    padding: var(--spacing-md) var(--spacing-lg);
    text-align: left;
    border-bottom: 1px solid var(--surface-border);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  td {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--surface-border);
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
    color: var(--text-primary);
  }

  .back-to-top {
    position: fixed;
    bottom: var(--spacing-lg);
    right: var(--spacing-lg);
    background: var(--ifm-color-primary);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    transform: translateY(20px);
  }

  .back-to-top.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

// JavaScript for page functionality
const searchScript = /* javascript */ `
  // Search functionality
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('coverage-search');
    const noResults = document.getElementById('no-results');

    // Check if we're on the overview (index) or details page
    const isDetailsPage = document.querySelector('table tbody tr') !== null;

    function performSearch() {
      const query = searchInput.value.toLowerCase().trim();
      let hasResults = false;

      if (!query) {
        // Show all items if search is empty
        if (isDetailsPage) {
          // On details page, search in table rows
          document.querySelectorAll('table tbody tr').forEach(row => {
            row.style.display = '';
          });
        } else {
          // On index page, search in cards and category sections
          document.querySelectorAll('.card, .category-section').forEach(item => {
            item.style.display = '';
          });
        }
        noResults.style.display = 'none';
        return;
      }

      if (isDetailsPage) {
        // Search in table rows for details page
        document.querySelectorAll('table tbody tr').forEach(row => {
          const rowContent = row.textContent.toLowerCase();
          if (rowContent.includes(query)) {
            row.style.display = '';
            hasResults = true;
          } else {
            row.style.display = 'none';
          }
        });
      } else {
        // Search in cards and category sections for overview page
        document.querySelectorAll('.card, .category-section').forEach(item => {
          const itemContent = item.textContent.toLowerCase();
          if (itemContent.includes(query)) {
            item.style.display = '';
            hasResults = true;
          } else {
            item.style.display = 'none';
          }
        });
      }

      // Show no results message if appropriate
      noResults.style.display = hasResults ? 'none' : 'block';
    }

    // Search on input
    if (searchInput) {
      searchInput.addEventListener('input', performSearch);
    }

    // Add keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  });

  // Back to top button
  document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });

      backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });
`;

function getCoverageClass(coverage) {
  const value = parseFloat(coverage);
  if (value >= 80) return 'coverage-high';
  if (value >= 50) return 'coverage-medium';
  return 'coverage-low';
}

function formatDate() {
  const now = new Date();
  return now.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function generateOverviewHtml(projectCoverage, getPercentage, overallMetrics) {
  return /* html */ `
<!DOCTYPE html>
<html lang="en">
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
    <div class="timestamp">Report generated: ${formatDate()}</div>

    <div class="search-container">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" id="coverage-search" class="search-input" placeholder="Search projects or files..." />
      <span class="search-shortcut">⌘K</span>
    </div>

    <div id="no-results" class="no-results">
      No matching projects found
    </div>

    <section class="overall-metrics">
      <h2>
        Overall Coverage
        <span class="timestamp">Total projects: ${Object.values(projectCoverage).reduce((acc, cat) => acc + Object.keys(cat.projects).length, 0)}</span>
      </h2>
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

  <script>
    ${searchScript}
  </script>
</body>
</html>`;
}

function generateDetailHtml(category, project, data, metrics, getPercentage) {
  return /* html */ `
<!DOCTYPE html>
<html lang="en">
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
      <h1 class="title">Coverage Details</h1>
      <p class="subtitle">Detailed coverage metrics for ${category}/${project}</p>
      <nav class="nav-links">
        <a href="index.html" class="nav-link">← Back to Overview</a>
        <a href="nyc/index.html" class="nav-link">Standard NYC Report</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <div class="timestamp">Report generated: ${formatDate()}</div>

    <div class="breadcrumb">
      <a href="index.html" style="color: var(--text-tertiary); text-decoration: none;">Home</a>
      <span class="breadcrumb-separator">/</span>
      <span style="color: var(--text-tertiary);">${category}</span>
      <span class="breadcrumb-separator">/</span>
      <strong>${project}</strong>
    </div>

    <div class="search-container">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" id="coverage-search" class="search-input" placeholder="Search files..." />
      <span class="search-shortcut">⌘K</span>
    </div>

    <div id="no-results" class="no-results">
      No matching files found
    </div>

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

    <button id="back-to-top" class="back-to-top" aria-label="Back to top">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </main>

  <script>
    ${searchScript}
  </script>
</body>
</html>`;
}

// Convert CommonJS exports to ES module exports
export { generateDetailHtml, generateOverviewHtml, getCoverageClass };
