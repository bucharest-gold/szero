'use strict';

const test = require('tape');

const cli = require('../bin/cli');

test('Should export a function', (t) => {
  t.equal(typeof cli, 'function', 'cli module should export a function');
  t.end();
});

test('Should fail with no package.json', (t) => {
  cli('package_with_no_package_json').then(null, (err) => {
    t.equal('package.json is require', err, 'should have the package.json is required message');
    t.end();
  });
});
