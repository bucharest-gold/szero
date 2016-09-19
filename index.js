'use strict';

const cli = require('./bin/cli');

module.exports = {
  report: function (directory, options) {
    return cli(directory, options);
  }
};
