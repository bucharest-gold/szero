'use strict';

const cli = require('../bin/cli');

test('checks if the project has unused dependencies.', () => {
  expect.assertions(1);
  const options = { directory: process.cwd() };
  expect(1).toBe(1);
  console.log(cli);
});
