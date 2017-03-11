'use strict';

// This will only read a file line by line.

const fs = require('fs');
const os = require('os');

function getFileLines (file) {
  const lines = [];
  fs.readFileSync(file)
    .toString()
    .split(os.EOL)
    .forEach(line => lines.push(line));
  return lines;
}

module.exports = { getFileLines };
