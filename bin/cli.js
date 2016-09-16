'use strict';

const reader = require('../lib/reader');
const searcher = require('../lib/searcher');
const reporter = require('../lib/reporter');
const log = require('../lib/log-color');

module.exports = function run (directory, options) {
  return new Promise((resolve, reject) => {
    options = options || {};
    let packageJson;
    try {
      packageJson = reader.read(directory + '/package.json');
    } catch (e) {
      const error = 'package.json is require';
      log.red(error);
      return reject(error);
    }
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

    const jsonReport = reporter.jsonReport(result, dependencies);
    reporter.consoleReport(jsonReport);
    reporter.fileReport(jsonReport);

    return resolve(jsonReport);
  });
};

