'use strict';

const test = require('tape');
const fs = require('fs');
const log = require('../lib/log-color');
const reader = require('../lib/reader');
const searcher = require('../lib/searcher');
const reporter = require('../lib/reporter');
const path = require('path');
const stdout = require('test-console').stdout;

test('Should test log-color.', (t) => {
  t.plan(7);
  const red = stdout.inspectSync(() => log.red('red'));
  t.deepEqual(red, ['\x1b[31mred\x1b[39m\n'], 'ANSI red.');
  const green = stdout.inspectSync(() => log.green('green'));
  t.deepEqual(green, ['\x1b[32mgreen\x1b[39m\n'], 'ANSI green.');
  const yellow = stdout.inspectSync(() => log.yellow('yellow'));
  t.deepEqual(yellow, ['\x1b[33myellow\x1b[39m\n'], 'ANSI yellow.');
  const magenta = stdout.inspectSync(() => log.magenta('magenta'));
  t.deepEqual(magenta, ['\x1b[35mmagenta\x1b[39m\n'], 'ANSI magenta.');

  t.equal(log.applyColor(1), '\x1b[31m[ 1 ]\x1b[39m', 'Only 1 usage is red.');
  t.equal(log.applyColor(2), '\x1b[33m[ 2 ]\x1b[39m', 'Only 2 usages is yellow.');
  t.equal(log.applyColor(99), '\x1b[32m[ 99 ]\x1b[39m', 'More than 2 usages is green.');
  t.end();
});

test('Should read a file.', (t) => {
  t.plan(2);
  const lines = reader.getFileLines(path.join(__dirname, '../sample_project/a/index.js'));
  t.equal(lines.length, 5, 'This file has 5 lines.');
  t.equal(lines.toString().includes('require'), true, 'This file contains a require keyword.');
  t.end();
});

test('Should find javascript files.', (t) => {
  t.plan(2);
  const files = searcher.searchJsFiles(path.join(__dirname, '../.'));
  t.true(files.length > 0, 'szero project has some files.');
  t.equal(files.toString().includes('reader.js'), true, 'reader.js file was found.');
  t.end();
});

test('Should find javascript files ignoring some directories.', (t) => {
  t.plan(2);
  const files = searcher.searchJsFiles(path.join(__dirname, '../.'), [], ['fixtures', 'sample_project']);
  t.equal(files.length, 12, `szero project has ${files.length} .js files, excluding fixtures and sample_project directories.`);
  t.equal(files.toString().includes('reader.js'), true, 'reader.js file was found.');
  t.end();
});

test('Should search for dependencies.', (t) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample_project', 'package.json'), 'utf-8'));
  const dependencies = searcher.searchDependencies(json, true);
  t.equal(dependencies[0][0].name === 'roi', true);
  t.end();
});

test('Should search for declarations.', (t) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample_project', 'package.json'), 'utf-8'));
  const dependencies = searcher.searchDependencies(json, true);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/a/index.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  t.equal(declarations.toString().includes('require'), true);
  t.end();
});

test('Should search for requires.', (t) => {
  const packageJsonLines = reader.getFileLines(path.join(__dirname, '../sample_project/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, true);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/a/index.js'));
  const requires = searcher.searchRequires(javascriptLines, dependencies[0]);
  t.equal(requires.toString().includes('require'), true);
  t.end();
});

test('Should ignore commented requires.', (t) => {
  const packageJsonLines = reader.getFileLines(path.join(__dirname, '../sample_project/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, true);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/c/d/f/index.js'));
  const requires = searcher.searchRequires(javascriptLines, dependencies[0]);
  t.equal(requires.toString(), 'require(\'opossum\')');
  t.end();
});

test('Should search for declaration usage.', (t) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample_project', 'package.json'), 'utf-8'));
  const dependencies = searcher.searchDependencies(json, false);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/a/index.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const usage = searcher.searchUsage(javascriptLines, 'index.js', declarations);
  t.equal(usage[0].declaration, 'roi-require(\'roi\')');
  t.equal(usage[0].file, 'index.js');
  t.equal(usage[0].line, 4);
  t.equal(1, 1);
  t.end();
});

test('Should search for missing dependencies.', (t) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample_project', 'package.json'), 'utf-8'));
  const dependencies = searcher.searchDependencies(json, true);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/c/d/f/index.js'));
  const missing = searcher.searchMissingDependencies(javascriptLines, dependencies);
  t.equal(missing.toString().includes('opossum'), true);
  t.end();
});

test('Should report.', (t) => {
  const packageJsonLines = reader.getFileLines(path.join(__dirname, '../sample_project/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, false);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/a/index.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const requires = searcher.searchRequires(javascriptLines, dependencies[0]);
  const usage = searcher.searchUsage(javascriptLines, 'index.js', declarations);
  const jsonReport = reporter.jsonReport(usage, dependencies, requires);
  const resultLogged = stdout.inspectSync(() => reporter.consoleReport(jsonReport));
  t.deepEqual(resultLogged.toString().includes('roi'), true);
  t.end();
});

test('Should report to file.', (t) => {
  const packageJsonLines = reader.getFileLines(path.join(__dirname, '../sample_project/package.json'));
  const dependencies = searcher.searchDependencies(packageJsonLines, false);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/a/index.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const requires = searcher.searchRequires(javascriptLines, dependencies[0]);
  const usage = searcher.searchUsage(javascriptLines, 'index.js', declarations);
  const jsonReport = reporter.jsonReport(usage, dependencies, requires);
  reporter.fileReport(jsonReport).then(() => {
    try {
      fs.statSync('szero.txt');
      t.equal(1, 1);
    } catch (e) {
      console.error(e);
      t.fail(e);
    }
    t.end();
  });
});

test('Should show unused dependencies from report.', (t) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample_project', 'package.json'), 'utf-8'));
  const dependencies = searcher.searchDependencies(json, false);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/a/index.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const unused = reporter.unused(declarations, dependencies[0]);
  const names = unused.map(u => u.name);
  t.equal(names.toString(), 'swapi-node');
  t.end();
});

test('Should show none for unused dependencies.', (t) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample_project', 'foo', 'package.json'), 'utf-8'));
  const dependencies = searcher.searchDependencies(json, false);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/foo/index.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const unused = reporter.unused(declarations, dependencies[0]);
  t.equal(unused, 'None.');
  t.end();
});

test('Should show all unused dependencies.', (t) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample_project', 'foo', 'package.json'), 'utf-8'));
  const dependencies = searcher.searchDependencies(json, false);
  const javascriptLines = reader.getFileLines(path.join(__dirname, '../sample_project/foo/all-unused.js'));
  const declarations = searcher.searchDeclarations(javascriptLines, dependencies[0]);
  const unused = reporter.unused(declarations, dependencies[0]);
  const names = unused.map(u => u.name);
  t.equal(names.toString(), 'roi');
  t.end();
});
