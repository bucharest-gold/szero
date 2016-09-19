#! /usr/bin/env node

const run = require('./cli');
const log = require('../lib/log-color');

const processArgs = process.argv;

if (processArgs.length >= 3) {
  // Default the console option when calling from the command line
  const options = {
    consoleReporter: true
  };

  // Find the --reporter= argv
  // Split on = and read the options
  const reporters = processArgs.filter((p) => {
    return p.indexOf('--reporters=') !== -1;
  });

  if (reporters.length !== 0) {
    const splitReporters = reporters[0].split('=');
    if (splitReporters[1] === 'file') {
      options.fileReporter = true;
    }
  }

  const ci = processArgs.filter(p => p.includes('ci'));
  if (ci.length) {
    options.ci = true;
  }

  run(processArgs[2], options);
} else {
  log.red('Usage: szero directory_here');
}
