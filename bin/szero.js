#! /usr/bin/env node

const run = require('./cli');
const program = require('commander');

program
  .version(require('../package.json').version)
  .usage('directory [--options]')
  .option('-f --file', 'enable file reporter')
  .option('--ci', 'enables process.exit() when unused dependency found')
  .option('--dev', 'enables devDependencies processing.')
  .option('--summary', 'enables summary report')
  .parse(process.argv);


if (program.args.length === 0) {
  program.help();
}

// Default the console option when calling from the command line
const options = {
  consoleReporter: true
};

options.fileReporter = program.file;
options.ci = program.ci;
options.dev = program.dev;

if (program.summary) {
  options.dev = true;
  options.summary = true;
}

run(program.args[0], options);
