#! /usr/bin/env node

const run = require('./cli');
const log = require('../lib/log-color');

if (process.argv.length === 3) {
  run(process.argv[2]);
} else {
  log.red('Usage: szero directory_here');
}
