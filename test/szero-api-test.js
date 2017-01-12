'use strict';

const test = require('tape');
const path = require('path');
const szero = require('../index');

test('should export report function', (t) => {
  t.equal(typeof szero.report, 'function', 'there should be a report function');
  t.equal(typeof szero.fileReport, 'function', 'there should be a fileReport function');
  t.end();
});

test('should return a promise', (t) => {
  const dir = path.join(__dirname, '../sample_project');
  const options = {};
  const szeroreturn = szero.report(dir, options);

  t.equal(szeroreturn instanceof Promise, true, 'should return a promise');
  t.end();
});

test('should return some info', (t) => {
  const dir = path.join(__dirname, '../sample_project');
  const options = {};
  szero.report(dir, options).then((jsonReport) => {
    t.equal(Object.keys(jsonReport).length, 7, 'should have 7 keys');
    t.true(jsonReport.groups, 'should have a groups object');
    t.true(jsonReport.dependencies, 'should have a dependencies object');
    t.true(jsonReport.devDependencies, 'should have a devDependencies object');
    t.true(jsonReport.declarations, 'should have a declarations object');
    t.true(jsonReport.totals, 'should have a totals object');
    t.true(jsonReport.unused, 'should have a unused object');
    t.true(jsonReport.requires, 'should have a requires object');
    t.end();
  });
});

test('should return unused Array with 1 Dep Object', (t) => {
  const dir = path.join(__dirname, '../sample_project');
  const options = {};
  szero.report(dir, options).then((jsonReport) => {
    t.true(jsonReport.unused, 'should have a unused object');
    t.equal(Array.isArray(jsonReport.unused), true, 'should be an array');
    t.equal(jsonReport.unused[0].name, 'swapi-node', 'should be an array');
    t.end();
  });
});

test('should return unused as string', (t) => {
  const dir = path.join(__dirname, '../.');
  const options = {};
  szero.report(dir, options).then((jsonReport) => {
    t.true(jsonReport.unused, 'should have a unused object');
    t.equal(Array.isArray(jsonReport.unused), false, 'should be an array');
    t.equal(jsonReport.unused, 'None.', 'should be an array');
    t.end();
  });
});

test('should return file info', (t) => {
  const dir = path.join(__dirname, '../sample_project');
  const options = {};
  szero.fileReport(dir, options).then((fileReport) => {
    t.equal(fileReport.indexOf('roi-require(\'roi\'):') > -1, true, 'The file report should have this require in it');
    t.end();
  });
});

test('should return some info with licenses', (t) => {
  const dir = path.join(__dirname, '../sample_project');
  const options = {
    license: true
  };
  szero.report(dir, options).then((jsonReport) => {
    t.equal(Object.keys(jsonReport).length, 8, 'should have 8 keys');
    t.true(jsonReport.groups, 'should have a groups object');
    t.true(jsonReport.dependencies, 'should have a dependencies object');
    t.true(jsonReport.devDependencies, 'should have a devDependencies object');
    t.true(jsonReport.declarations, 'should have a declarations object');
    t.true(jsonReport.totals, 'should have a totals object');
    t.true(jsonReport.unused, 'should have a unused object');
    t.true(jsonReport.licenses, 'should have the licenses object');
    t.true(jsonReport.requires, 'should have a requires object');
    t.end();
  });
});
