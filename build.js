#!/usr/bin/env node
// Stamps local script references with ?v=<short-git-hash>
// so browsers fetch fresh assets after a deploy.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const hash = getBuildVersion();

const indexFile = path.join(__dirname, 'index.html');
const jsDirectory = path.join(__dirname, 'js');

stampIndexHtml(indexFile, hash);
stampModuleImports(jsDirectory, hash);

console.log(`Stamped local assets with v=${hash}`);

function getBuildVersion() {
  const headHash = execFileSync('git', ['rev-parse', '--short', 'HEAD'])
    .toString()
    .trim();
  const workingTreeStatus = execFileSync('git', ['status', '--short'])
    .toString()
    .trim();

  if (!workingTreeStatus) {
    return headHash;
  }

  return `${headHash}-dirty-${Date.now().toString(36)}`;
}

function stampIndexHtml(filePath, version) {
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(
    /src="(js\/[^"?]+)(\?v=[^"]*)?"/g,
    `src="$1?v=${version}"`
  );

  html = html.replace(
    /import\('\.\/(js\/[^'?]+)(\?v=[^']*)?'/g,
    `import('./$1?v=${version}'`
  );

  fs.writeFileSync(filePath, html, 'utf8');
}

function stampModuleImports(directoryPath, version) {
  const moduleFiles = fs
    .readdirSync(directoryPath)
    .filter(fileName => fileName.endsWith('.js'));

  for (const fileName of moduleFiles) {
    const filePath = path.join(directoryPath, fileName);
    const source = fs.readFileSync(filePath, 'utf8');
    const stampedSource = stampModuleSource(source, version);

    if (stampedSource !== source) {
      fs.writeFileSync(filePath, stampedSource, 'utf8');
    }
  }
}

function stampModuleSource(source, version) {
  const patterns = [
    {
      regex: /(from\s+['"])(\.\/[^"'?]+\.js)(\?v=[^'"]*)?(['"])/g,
      replacement: `$1$2?v=${version}$4`,
    },
    {
      regex: /(import\s+['"])(\.\/[^"'?]+\.js)(\?v=[^'"]*)?(['"])/g,
      replacement: `$1$2?v=${version}$4`,
    },
    {
      regex: /(import\s*\(\s*['"])(\.\/[^"'?]+\.js)(\?v=[^'"]*)?(['"]\s*\))/g,
      replacement: `$1$2?v=${version}$4`,
    },
  ];

  return patterns.reduce((currentSource, pattern) => {
    return currentSource.replace(pattern.regex, pattern.replacement);
  }, source);
}
