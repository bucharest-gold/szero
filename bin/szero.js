#! /usr/bin/env node

const run = require('./cli');
const program = require('commander');

program
  .version(require('../package.json').version)
  .usage('directory [--options]')
  .option('-i --ignore [list]', 'ignore the specified directories. e.g: bower_components,examples')
  .option('-f --file', 'enable file reporter.')
  .option('-l --license', 'enable license lookup.')
  .option('--filename <filename>', 'change the default filename.')
  .option('--ci', 'enables process.exit() when unused dependency found.')
  .option('--dev', 'enables devDependencies processing.')
  .option('--summary', 'enables summary report.')
  .option('--silent', 'hides the console output.')
  .parse(process.argv);

if (program.args.length === 0) {
  program.help();
}

// Default the console option when calling from the command line
const options = {
  consoleReporter: true
};

if (program.silent) {
  options.consoleReporter = false;
}

options.fileReporter = program.file;

if (program.filename) {
  options.filename = program.filename;
  options.fileReporter = true;
}

if (program.ignore) {
  options.ignore = program.ignore.split(',').map((d) => d.trim());
}

options.ci = program.ci;
options.dev = program.dev;

options.license = program.license;

if (program.summary) {
  options.dev = false;
  options.summary = true;
}

run(program.args[0], options);
