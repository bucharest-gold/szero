/**
* @module szero
*/

'use strict';

const cli = require('./bin/cli');
const reporter = require('./lib/reporter');

/**
  JSON Reporter
  @param {string} directory - path to your project
  @param {object} [options]
  @param {boolean} [options.license] - If true, will fetch license information for each dependency. default: false
  @returns {Promise} - returns a Promise with the repoter values as JSON
  @instance
*/
function report (directory, options) {
  return cli(directory, options);
}

/**
  File Format Reporter
  @param {string} directory - path to your project
  @param {object} [options]
  @returns {Promise} - returns a Promise with the repoter values as a String in the File Format
  @instance
*/
function fileReport (directory, options) {
  return this.report(directory, options).then((jsonReport) => {
    return reporter.createFileReport(jsonReport);
  });
}

module.exports = {
  report: report,
  fileReport: fileReport
};
