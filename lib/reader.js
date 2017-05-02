'use strict';

// This will only read a file line by line.

const fs = require('fs');
const os = require('os');
const decomment = require('decomment');

function getFileLines (file) {
  const lines = [];
  let decommented;
  try {
    const strFile = fs.readFileSync(file).toString().replace(/#/g, ' ');
    decommented = decomment(strFile);
  } catch (e) {
    console.error(file, e);
  }
  decommented.split(os.EOL)
    .forEach(line => lines.push(line));
  return lines;
}

module.exports = { getFileLines };
