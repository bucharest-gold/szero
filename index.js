'use strict';

const reader = require('./lib/reader');
const searcher = require('./lib/searcher');
const reporter = require('./lib/reporter');

function run (directory) {
  const packageJson = reader.read(directory + '/package.json');
  const dependencies = searcher.searchDependencies(packageJson);
  const files = reader.find(directory);
  const result = [];
  files.forEach(file => {
    const lines = reader.read(file);
    const declarations = searcher.searchDeclarations(lines, dependencies);
    const usage = searcher.searchUsage(lines, file, declarations);
    if (usage.length) {
      result.push(usage);
    }
  });
  reporter.report(result);
}

run('../litoria');
