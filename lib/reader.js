'use strict';

// This will only read a file line by line.

const fs = require('fs');
const decomment = require('decomment');

function getFileLines (file) {
  const lines = [];
  let decommented, EOL;
  const strFile = fs.readFileSync(file).toString().replace(/#/g, ' ');
  try {
    EOL = decomment.getEOL(strFile);
    decommented = decomment(strFile);
  } catch (e) {
    console.error(file, e);
    return lines;
  }
  decommented.split(EOL)
    .forEach(line => lines.push(line));
  return lines;
}

module.exports = { getFileLines };
