'use strict';

const fs = require('fs');

function getFileLines (file) {
  const lines = [];
  fs.readFileSync(file)
    .toString()
    .split('\n')
    .forEach(line => lines.push(line));
  return lines;
}

function isGoodDirectory (dir) {
  return !dir.includes('node_modules') &&
    !dir.includes('coverage') &&
    !dir.includes('doc') &&
    !dir.includes('docs');
}

function findJsFiles (dir, list) {
  let jsFiles = list || [];
  const files = fs.readdirSync(dir);
  files.forEach((f) => {
    if (isGoodDirectory(dir)) {
      if (fs.statSync(`${dir}/${f}`).isDirectory()) {
        jsFiles = findJsFiles(`${dir}/${f}`, jsFiles);
      } else if (f.endsWith('.js')) {
        jsFiles.push(`${dir}/${f}`);
      }
    }
  });
  return jsFiles;
}

module.exports = { getFileLines, findJsFiles };
