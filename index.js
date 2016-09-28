'use strict';

const cli = require('./bin/cli');
const reporter = require('./lib/reporter');

module.exports = {
  report: function (directory, options) {
    return cli(directory, options);
  },
  fileReport: function (directory, options) {
    return this.report(directory, options).then((jsonReport) => {
      const createFileReport = reporter.createFileReport(jsonReport);
      return Promise.resolve(createFileReport);
    });
  }
};
