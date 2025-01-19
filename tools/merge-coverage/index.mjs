/* eslint-disable security/detect-object-injection */
import { execSync } from 'child_process';
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/color-level-logger.mjs';
import { generateDetailHtml, generateOverviewHtml } from './template.mjs';

const require = createRequire(import.meta.url);
const nycPath = require.resolve('nyc/bin/nyc.js');
const httpServerPath = require.resolve('http-server/bin/http-server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cleanStackRoot = path.join(__dirname, '../../');
const coverageDir = path.join('coverage');
const outputFile = path.join(coverageDir, 'merged-coverage.json');

// Generate two HTML files - overview and details
const overviewReportFile = path.join(coverageDir, 'index.html');
const detailsReportFile = path.join(coverageDir, 'details.html');

function getProjectRoot(filePath) {
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
  logger.info('Scanning for coverage files...');
  const coverageFiles = fs
    .readdirSync(coverageDir, { recursive: true })
    .filter(file => file.endsWith('coverage-final.json'))
    .map(file => path.join(coverageDir, file));

  if (coverageFiles.length === 0) {
    throw new Error('No coverage files found');
  }

  logger.info(`Found ${coverageFiles.length} coverage files`);

  coverageFiles.forEach(file => {
    const newFileName = file.replaceAll('/', '-');
    logger.info(`Processing: ${newFileName}`);
    execSync(`mv ${file} ${coverageDir}/${newFileName}`);
  });

  execSync(`find ${coverageDir} -type d -empty -delete`);
  execSync(`${nycPath} merge ${coverageDir} ${outputFile}`);

  const nycReportDir = path.join(coverageDir, 'nyc');

  // Update NYC report generation command
  logger.info('Generating standard NYC report...');
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
    if (metric.total === 0) return '100';
    const percentage = (metric.covered / metric.total) * 100;
    return percentage % 1 === 0 ? percentage.toString() : percentage.toFixed(2);
  }

  function calculateOverallMetrics(projectCoverage) {
    const overall = {
      statements: { total: 0, covered: 0 },
      branches: { total: 0, covered: 0 },
      functions: { total: 0, covered: 0 },
      lines: { total: 0, covered: 0 },
    };

    Object.values(projectCoverage).forEach(category => {
      Object.values(category.projects).forEach(project => {
        ['statements', 'branches', 'functions', 'lines'].forEach(metric => {
          overall[metric].total += project.summary[metric].total;
          overall[metric].covered += project.summary[metric].covered;
        });
      });
    });

    return {
      statements: getPercentage(overall.statements),
      branches: getPercentage(overall.branches),
      functions: getPercentage(overall.functions),
      lines: getPercentage(overall.lines),
    };
  }

  logger.info('Processing coverage data...');
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

  logger.info('Generating reports...');
  const overallMetrics = calculateOverallMetrics(projectCoverage);
  fs.writeFileSync(overviewReportFile, generateOverviewHtml(projectCoverage, getPercentage, overallMetrics));

  // Create separate detail files for each project
  Object.entries(projectCoverage).forEach(([category, categoryData]) => {
    Object.entries(categoryData.projects).forEach(([project, data]) => {
      const metrics = {
        statements: getPercentage(data.summary.statements),
        branches: getPercentage(data.summary.branches),
        functions: getPercentage(data.summary.functions),
        lines: getPercentage(data.summary.lines),
      };

      const detailHtml = generateDetailHtml(category, project, data, metrics, getPercentage);
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

  logger.info('Starting HTTP server...');
  execSync(`${httpServerPath} ./coverage -p 9999 -o`, {
    stdio: 'inherit',
  });
} catch (error) {
  logger.error('\n🚨');
  logger.error(error);
  process.exit(1);
}
