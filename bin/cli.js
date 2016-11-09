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
    const dependencies = searcher.searchDependencies(packageJson, options.dev);
    const files = reader.find(directory);
    const result = [];
    const missingDependencies = new Set();
    files.forEach(file => {
      const lines = reader.read(file);
      if (options.summary) {
        const missing = searcher.searchMissingDependencies(lines, dependencies);
        if (missing.length) {
          missingDependencies.add(missing.toString());
        }
      }
      const declarations = searcher.searchDeclarations(lines, dependencies[0]);
      const usage = searcher.searchUsage(lines, file, declarations);
      if (usage.length) {
        result.push(usage);
      }
    });

    const jsonReport = reporter.jsonReport(result, dependencies);

    if (options.summary) {
      reporter.summary(jsonReport, Array.from(missingDependencies));
    } else {
      if (jsonReport.unused !== 'None.' && options.ci) {
        reporter.consoleReport(jsonReport);
        process.exit(1);
      }

      if (options.consoleReporter) {
        reporter.consoleReport(jsonReport, options);
        return resolve(jsonReport);
      }

      if (options.fileReporter) {
        reporter.fileReport(jsonReport, options);
        return resolve(jsonReport);
      }
    }

    if (!options.license) {
      return resolve(jsonReport);
    }

    reporter.licenseReport(jsonReport.dependencies).then((licenses) => {
      jsonReport.licenses = licenses;
      return resolve(jsonReport);
    }).catch((err) => {
      // There was an error with the getting of the license
      return reject(err);
    });
  });
};
