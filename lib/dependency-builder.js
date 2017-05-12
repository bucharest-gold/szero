'use strict';
const path = require('path');
const reader = require('./reader');
const searcher = require('./searcher');

function buildDependencies (packageJson, options) {
  return searcher.searchDependencies(packageJson, options.dev);
}

function buildRequires (files) {
  const requires = new Set();
  files.forEach(file => {
    const lines = reader.getFileLines(file);
    const require = searcher.searchRequires(lines).filter(e => e != null);
    if (require.length) {
      require.forEach(r => {
        const requireText = searcher.getTextFromRequire(r);
        if (requireText) {
          const dirFile = path.dirname(file);
          const completePath = path.resolve(dirFile, requireText);
          requires.add(path.relative(process.cwd(), completePath));
        }
      });
    }
  });
  return requires;
}

function buildResult (files, dependencies) {
  const result = [];
  files.filter(file => {
    const lines = reader.getFileLines(file);
    const declarations = searcher.searchDeclarations(lines, dependencies[0]);
    const usage = searcher.searchUsage(lines, file, declarations);
    if (usage.length) {
      result.push(usage);
    }
  });
  return result;
}

function buildMissingDependencies (files, dependencies) {
  const missingDependencies = files
  .filter(file => {
    const lines = reader.getFileLines(file);
    const missing = searcher.searchMissingDependencies(lines, dependencies);
    return missing.length > 0;
  })
  .map(file => file.toString());

  return new Set(missingDependencies);
}

module.exports = {
  buildDependencies,
  buildRequires,
  buildResult,
  buildMissingDependencies
};
