'use strict';

const test = require('tape');
const path = require('path');

const cli = require('../bin/cli');

test.skip('Should export a function', (t) => {
  t.equal(typeof cli, 'function', 'cli module should export a function');
  t.end();
});

test('Should not fail with no package.json', (t) => {
  console.log(path.join(__dirname, '..', 'test/sample_project_no_package_json'));
  cli(path.join(__dirname, '..', 'test/sample_project_no_package_json')).then(_ => {
    t.end();
  }).catch(t.fail);
});

test('Should pass and return an object with real project', (t) => {
  cli(path.join(__dirname, 'sample_project')).then((report) => {
    t.pass();
    t.end();
  });
});

test('Should run a summary report', (t) => {
  cli(path.join(__dirname, 'sample_project'), {
    summary: true
  }).then((report) => {
    t.deepEqual(report.dependencies.map(d => d.name), [ 'roi', 'swapi-node' ]);
    t.deepEqual(report.unused.map(d => d.name), [ 'swapi-node' ]);
    t.deepEqual(report.devDependencies, []);
    t.pass();
    t.end();
  });
});
