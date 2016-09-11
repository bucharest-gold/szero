'use strict';

const test = require('tape');
const szero = require('../index');

test('Should foo.', t => {
  console.log('foo', szero);
  t.equal(1, 1);
  t.end();
});
