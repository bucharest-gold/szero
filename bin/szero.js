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

  // If --ci=true, enables process.exit() when unused dependency found.
  const ci = processArgs.filter(p => p.includes('--ci='));
  if (ci.length) {
    if (ci[0].split('=')[1] === 'true') {
      options.ci = true;
    }
  }

  // If --dev=true, enables devDependencies processing.
  const dev = processArgs.filter(p => p.includes('--dev='));
  if (dev.length) {
    if (dev[0].split('=')[1] === 'true') {
      options.dev = true;
    }
  }

  // If --summary=true, Show only summary report.
  const summary = processArgs.filter(p => p.includes('--summary='));
  if (summary.length) {
    if (summary[0].split('=')[1] === 'true') {
      options.summary = true;
      options.dev = true;
    }
  }

  run(processArgs[2], options);
} else {
  log.red('Usage: szero directory_here');
}
