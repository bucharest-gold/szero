'use strict';

// This will only read a file line by line.

const fs = require('fs');

function getFileLines (file) {
  const lines = [];
  fs.readFileSync(file)
    .toString()
    .split('\n')
    .forEach(line => lines.push(line));
  return lines;
}

module.exports = { getFileLines };
