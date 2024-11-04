const sharedStyles = `
  :root {
    --gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6);
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 2rem;
    background: #f8fafc;
    color: #1e293b;
    line-height: 1.5;
  }

  .header {
    background: var(--gradient-primary);
    margin: -2rem -2rem 2rem -2rem;
    padding: 2rem;
    color: white;
    box-shadow: var(--shadow-md);
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(to right, #fff, #e2e8f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    color: rgba(255,255,255,0.9);
    font-size: 1.1rem;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .metric {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: var(--shadow-sm);
  }

  .metric:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .metric-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 0.25rem;
  }

  .coverage-high {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    color: #166534;
  }

  .coverage-medium {
    background: linear-gradient(135deg, #fef9c3, #fde047);
    color: #854d0e;
  }

  .coverage-low {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #991b1b;
  }

  .nav-links {
    margin-bottom: 2rem;
    display: flex;
    gap: 1rem;
  }

  .nav-link {
    color: #4f46e5;
    text-decoration: none;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    background: white;
    box-shadow: var(--shadow-sm);
    transition: all 0.2s;
    font-weight: 500;
  }

  .nav-link:hover {
    background: var(--gradient-primary);
    color: white;
    box-shadow: var(--shadow-md);
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .card {
    border-radius: 12px;
    padding: 1.5rem;
    background: white;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s;
    border: 1px solid #e2e8f0;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f1f5f9;
  }

  .category-section {
    margin-bottom: 4rem;
  }

  .category-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-title::before {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    background: var(--gradient-primary);
    border-radius: 4px;
  }

  table {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }

  th {
    background: var(--gradient-primary);
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.875rem;
  }

  th, td {
    padding: 1rem;
    text-align: left;
  }

  tr:nth-child(even) {
    background: #f8fafc;
  }

  tr:hover {
    background: #f1f5f9;
  }

  .file-path {
    font-family: ui-monospace, monospace;
    font-size: 0.875rem;
    color: #475569;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #64748b;
    margin-bottom: 2rem;
    font-size: 1.25rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: var(--shadow-sm);
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .summary-card {
    border-radius: 12px;
    padding: 1.5rem;
    background: white;
    box-shadow: var(--shadow-md);
    text-align: center;
  }
`;

function getCoverageClass(coverage) {
  const value = parseFloat(coverage);
  if (value >= 80) return 'coverage-high';
  if (value >= 50) return 'coverage-medium';
  return 'coverage-low';
}

function generateOverviewHtml(projectCoverage, getPercentage) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Coverage Overview</title>
  <style>${sharedStyles}</style>
</head>
<body>
  <div class="header">
    <div class="title">Coverage Overview</div>
    <div class="subtitle">Coverage report by category and project</div>
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
  <div class="nav-links">
    <a href="nyc/index.html" class="nav-link">Standard NYC Report</a>
  </div>
</body>
</html>`;
}

function generateDetailHtml(category, project, data, metrics, getPercentage) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Coverage: ${category}/${project}</title>
  <style>${sharedStyles}</style>
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

module.exports = {
  generateOverviewHtml,
  generateDetailHtml,
  getCoverageClass,
};
