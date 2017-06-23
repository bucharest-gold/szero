'use strict';
const fs = require('fs');
const reader = require('../lib/reader');
const searcher = require('../lib/searcher');
const reporter = require('../lib/reporter');
const log = require('../lib/log-color');
const builder = require('../lib/dependency-builder');

module.exports = function run (directory, options) {
  return new Promise((resolve, reject) => {
    let packageJson;
    options = options || {};

    try {
      packageJson = JSON.parse(fs.readFileSync(`${directory}/package.json`, 'utf-8'));
    } catch (e) {
      packageJson = [];
      log.red('No package.json file found. Scanning directory for .js files.');
    }
    const files = searcher.searchJsFiles(directory, [], options.ignore);
    const dependencies = builder.buildDependencies(packageJson, options);
    const result = builder.buildResult(files, dependencies);
    const requires = builder.buildRequires(files);

    const jsonReport = reporter.jsonReport(result, dependencies, requires);

    if (options.summary) {
      const missingDependencies = new Set(builder.buildMissingDependencies(files, dependencies));
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
