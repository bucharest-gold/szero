'use strict';

const test = require('tape');
const log = require('../lib/log-color');
const reader = require('../lib/reader');
const path = require('path');
const stdout = require('test-console').stdout;

test('Should test log-color.', t => {
  const red = stdout.inspectSync(() => log.red('red'));
  t.deepEqual(red, ['\x1b[31mred\x1b[39m\n']);
  const green = stdout.inspectSync(() => log.green('green'));
  t.deepEqual(green, ['\x1b[32mgreen\x1b[39m\n']);
  const yellow = stdout.inspectSync(() => log.yellow('yellow'));
  t.deepEqual(yellow, ['\x1b[33myellow\x1b[39m\n']);

  t.equal('\x1b[31m[ 1 ]\x1b[39m', log.applyColor(1));
  t.equal('\x1b[33m[ 2 ]\x1b[39m', log.applyColor(2));
  t.equal('\x1b[32m[ 99 ]\x1b[39m', log.applyColor(99));
  t.end();
});

test('Should read a file.', t => {
  const lines = reader.read(path.join(__dirname, '/fixtures/foo/x.js'));
  t.equal(lines.toString().includes('require'), true);
  t.end();
});

test('Should find javascript files.', t => {
  const files = reader.find(path.join(__dirname, '../.'));
  t.equal(files.toString().includes('reader.js'), true);
  t.end();
});
