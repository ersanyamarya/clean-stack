const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const nycPath = require.resolve('nyc/bin/nyc.js');
const httpServerPath = require.resolve('http-server/bin/http-server');

const coverageDir = path.join('coverage');
const outputFile = path.join(coverageDir, 'merged-coverage.json');

// Generate two HTML files - overview and details
const overviewReportFile = path.join(coverageDir, 'index.html');
const detailsReportFile = path.join(coverageDir, 'details.html');

function getProjectRoot(filePath) {
  const cleanStackRoot = '/Users/sanyam.arya/ws/clean-stack';
  const relativePath = filePath.replace(cleanStackRoot, '');
  const parts = relativePath.split('/').filter(Boolean);

  if (parts.length >= 2) {
    return {
      category: parts[0],
      project: parts[1],
    };
  }

  return {
    category: 'root',
    project: parts[0] || 'unknown',
  };
}

try {
  console.log('Scanning for coverage files...');
  const coverageFiles = fs
    .readdirSync(coverageDir, { recursive: true })
    .filter(file => file.endsWith('coverage-final.json'))
    .map(file => path.join(coverageDir, file));

  if (coverageFiles.length === 0) {
    throw new Error('No coverage files found');
  }

  console.log(`Found ${coverageFiles.length} coverage files`);

  coverageFiles.forEach(file => {
    const newFileName = file.replaceAll('/', '-');
    console.log(`Processing: ${newFileName}`);
    execSync(`mv ${file} ${coverageDir}/${newFileName}`);
  });

  execSync(`find ${coverageDir} -type d -empty -delete`);
  execSync(`${nycPath} merge ${coverageDir} ${outputFile}`);

  const nycReportDir = path.join(coverageDir, 'nyc');

  // Update NYC report generation command
  console.log('Generating standard NYC report...');
  execSync(`${nycPath} report --reporter=html --reporter=text -t coverage --report-dir=${nycReportDir}`, {
    stdio: 'inherit',
  });

  function calculateMetrics(fileData) {
    const metrics = {
      statements: { total: 0, covered: 0 },
      branches: { total: 0, covered: 0 },
      functions: { total: 0, covered: 0 },
      lines: { total: 0, covered: 0 },
    };

    Object.values(fileData.s || {}).forEach(count => {
      metrics.statements.total++;
      if (count > 0) metrics.statements.covered++;
    });

    Object.values(fileData.b || {}).forEach(branches => {
      branches.forEach(count => {
        metrics.branches.total++;
        if (count > 0) metrics.branches.covered++;
      });
    });

    Object.values(fileData.f || {}).forEach(count => {
      metrics.functions.total++;
      if (count > 0) metrics.functions.covered++;
    });

    Object.values(fileData.l || {}).forEach(count => {
      metrics.lines.total++;
      if (count > 0) metrics.lines.covered++;
    });

    return metrics;
  }

  function addMetricsToDirectory(dirMetrics, fileMetrics) {
    ['statements', 'branches', 'functions', 'lines'].forEach(metric => {
      dirMetrics[metric].total += fileMetrics[metric].total;
      dirMetrics[metric].covered += fileMetrics[metric].covered;
    });
  }

  function getPercentage(metric) {
    return metric.total === 0 ? 100 : ((metric.covered / metric.total) * 100).toFixed(2);
  }

  console.log('Processing coverage data...');
  const coverage = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  const projectCoverage = {};

  Object.entries(coverage).forEach(([filePath, fileData]) => {
    const { category, project } = getProjectRoot(filePath);
    const remainingPath = filePath.replace(new RegExp(`.*?${project}/`), '');

    if (!projectCoverage[category]) {
      projectCoverage[category] = {
        summary: {
          statements: { total: 0, covered: 0 },
          branches: { total: 0, covered: 0 },
          functions: { total: 0, covered: 0 },
          lines: { total: 0, covered: 0 },
        },
        projects: {},
        fileCount: 0,
      };
    }

    if (!projectCoverage[category].projects[project]) {
      projectCoverage[category].projects[project] = {
        summary: {
          statements: { total: 0, covered: 0 },
          branches: { total: 0, covered: 0 },
          functions: { total: 0, covered: 0 },
          lines: { total: 0, covered: 0 },
        },
        files: {},
        fileCount: 0,
      };
    }

    const metrics = calculateMetrics(fileData);
    addMetricsToDirectory(projectCoverage[category].summary, metrics);
    addMetricsToDirectory(projectCoverage[category].projects[project].summary, metrics);
    projectCoverage[category].projects[project].files[remainingPath] = metrics;
    projectCoverage[category].projects[project].fileCount++;
    projectCoverage[category].fileCount++;
  });

  const sharedStyles = `
  body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem auto; max-width: 1200px; padding: 0 1rem; }
  .header { margin-bottom: 2rem; }
  .title { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
  .subtitle { color: #666; }
  .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
  .metric { text-align: center; padding: 0.5rem; border-radius: 4px; }
  .metric-label { font-size: 0.875rem; color: #666; }
  .metric-value { font-size: 1.25rem; font-weight: bold; }
  .coverage-high { background-color: #d4edda; color: #155724; }
  .coverage-medium { background-color: #fff3cd; color: #856404; }
  .coverage-low { background-color: #f8d7da; color: #721c24; }
  .nav-links { margin-bottom: 2rem; }
    .nav-link {
      color: #1869b9;
      text-decoration: none;
      margin-right: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      background: #f1f8ff;
      transition: background 0.2s;

    }

    .nav-link:hover {
      background: #e9f2ff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

  /* Detail page specific */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .summary-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  th, td {
    padding: 0.75rem;
    text-align: left;
    border: 2px solid #f8f9fa;
  }
  th { background: #f8f9fa; }
  .file-path { font-family: monospace; }

  /* Overview page specific */
  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  .card-title { font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem; }
  .category-section { margin-bottom: 3rem; }
  .category-title {
    font-size: 1.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #eee;
  }
  .category-summary {
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: #f8f9fa;
    border-radius: 4px;
  }
`;

  // Generate overview HTML
  const overviewHtml = `
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
</html>
  `;

  function getCoverageClass(coverage) {
    const value = parseFloat(coverage);
    if (value >= 80) return 'coverage-high';
    if (value >= 50) return 'coverage-medium';
    return 'coverage-low';
  }

  console.log('Generating reports...');
  fs.writeFileSync(overviewReportFile, overviewHtml);

  // Create separate detail files for each project
  Object.entries(projectCoverage).forEach(([category, categoryData]) => {
    Object.entries(categoryData.projects).forEach(([project, data]) => {
      const metrics = {
        statements: getPercentage(data.summary.statements),
        branches: getPercentage(data.summary.branches),
        functions: getPercentage(data.summary.functions),
        lines: getPercentage(data.summary.lines),
      };

      const detailHtml = `
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

      const detailFileName = `${category}-${project}.html`;
      fs.writeFileSync(path.join(coverageDir, detailFileName), detailHtml);
    });
  });

  // Clean up - remove details.html since we don't need it anymore
  if (fs.existsSync(detailsReportFile)) {
    fs.unlinkSync(detailsReportFile);
  }

  // Clean up
  coverageFiles.forEach(file => {
    const newFileName = file.replaceAll('/', '-');
    execSync(`rm ${coverageDir}/${newFileName}`);
  });
  execSync(`rm -rf ${outputFile}`);

  console.log('Starting HTTP server...');
  execSync(`${httpServerPath} ./coverage -p 9999 -o`, {
    stdio: 'inherit',
  });
} catch (error) {
  console.error('\n🚨');
  console.error(error);
  process.exit(1);
}
