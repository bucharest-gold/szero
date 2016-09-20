'use strict';

const test = require('tape');
const fs = require('fs');
const log = require('../lib/log-color');
const reader = require('../lib/reader');
const searcher = require('../lib/searcher');
const reporter = require('../lib/reporter');
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

test('Should search for dependencies.', t => {
  const lines = reader.read(path.join(__dirname, '/fixtures/package.json'));
  const dependencies = searcher.searchDependencies(lines, true);
  t.equal(dependencies[0].toString().includes('roi'), true);
  t.end();
});

test('Should search for declarations.', t => {
  const packageJsonLines = reader.read(path.join(__dirname, '/fixtures/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, true);
  const javascriptLines = reader.read(path.join(__dirname, '/fixtures/foo/x.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  t.equal(declarations.toString().includes('require'), true);
  t.end();
});

test('Should search for declaration usage.', t => {
  const packageJsonLines = reader.read(path.join(__dirname, '/fixtures/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, false);
  const javascriptLines = reader.read(path.join(__dirname, '/fixtures/foo/x.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const usage = searcher.searchUsage(javascriptLines, 'x.js', declarations);
  t.equal(usage[0].declaration, 'roi-require(\'roi\')');
  t.equal(usage[0].file, 'x.js');
  t.equal(usage[0].line, 4);
  t.equal(1, 1);
  t.end();
});

test('Should report.', t => {
  const packageJsonLines = reader.read(path.join(__dirname, '/fixtures/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, false);
  const javascriptLines = reader.read(path.join(__dirname, '/fixtures/foo/x.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const usage = searcher.searchUsage(javascriptLines, 'x.js', declarations);
  const jsonReport = reporter.jsonReport(usage, dependencies[0]);
  const resultLogged = stdout.inspectSync(() => reporter.consoleReport(jsonReport));
  t.deepEqual(resultLogged.toString().includes('roi'), true);
  t.end();
});

test('Should report to file.', t => {
  const packageJsonLines = reader.read(path.join(__dirname, '/fixtures/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, false);
  const javascriptLines = reader.read(path.join(__dirname, '/fixtures/foo/x.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const usage = searcher.searchUsage(javascriptLines, 'x.js', declarations);
  const jsonReport = reporter.jsonReport(usage, dependencies[0]);
  reporter.fileReport(jsonReport);
  try {
    fs.statSync('szero.txt');
    t.equal(1, 1);
  } catch (e) {
    console.error(e);
    t.fail(e);
  }
  t.end();
});

test('Should show unused dependencies from report.', t => {
  const packageJsonLines = reader.read(path.join(__dirname, '/fixtures/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, false);
  const javascriptLines = reader.read(path.join(__dirname, '/fixtures/foo/x.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const unused = reporter.unused(declarations, dependencies[0]);
  t.equal(unused.toString(), 'fidelity,request');
  t.end();
});
