#!/usr/bin/env node
// Stamps all local JS references in index.html with ?v=<short-git-hash>
// so browsers always fetch fresh files after a deploy.

const fs = require('fs');
const { execFileSync } = require('child_process');

const hash = execFileSync('git', ['rev-parse', '--short', 'HEAD']).toString().trim();
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');

// Replace src="js/..." with src="js/...?v=HASH" (skip CDN URLs)
// Also handles existing ?v= params by replacing them
html = html.replace(
  /src="(js\/[^"?]+)(\?v=[^"]*)?"/g,
  `src="$1?v=${hash}"`
);

// Same for dynamic import('./js/...')
html = html.replace(
  /import\('\.\/js\/([^'?]+)(\?v=[^']*)?'/g,
  `import('./js/$1?v=${hash}'`
);

fs.writeFileSync(file, html, 'utf8');
console.log(`Stamped ${file} with v=${hash}`);
