const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const nycPath = require.resolve('nyc/bin/nyc.js');
const httpServerPath = require.resolve('http-server/bin/http-server');

const coverageDir = path.join('coverage');
const outputFile = path.join(coverageDir, 'merged-coverage.json');

const coverageFiles = fs
  .readdirSync(coverageDir, { recursive: true })
  .filter(file => file.endsWith('coverage-final.json'))
  .map(file => path.join(coverageDir, file));

coverageFiles.forEach(file => {
  const newFileName = file.replaceAll('/', '-');
  console.log(newFileName);
  execSync(`mv ${file} ${coverageDir}/${newFileName}`);
});

// remove all directories
execSync(`find ${coverageDir} -type d -empty -delete`);

execSync(`${nycPath} merge ${coverageDir} ${outputFile}`);

execSync(`${nycPath} report --reporter=html --reporter=text -t coverage --report-dir=./coverage/merged`, {
  stdio: 'inherit',
});

// run and expose on port 9999

execSync(`${httpServerPath} ./coverage/merged -p 9999 -o`, {
  stdio: 'inherit',
});
