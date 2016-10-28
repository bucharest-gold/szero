'use strict';

module.exports = {
  red: red,
  green: green,
  yellow: yellow,
  magenta: magenta,
  applyColor: applyColor
};

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[39m';

function red (str) {
  console.log(`${RED}${str}${RESET}`);
}

function green (str) {
  console.log(`${GREEN}${str}${RESET}`);
}

function magenta (str) {
  console.log(`${MAGENTA}${str}${RESET}`);
}

function yellow (str) {
  console.log(`${YELLOW}${str}${RESET}`);
}

function applyColor (str) {
  if (str === 1) {
    str = RED + '[ ' + str + ' ]' + RESET;
  } else if (str === 2) {
    str = YELLOW + '[ ' + str + ' ]' + RESET;
  } else {
    str = GREEN + '[ ' + str + ' ]' + RESET;
  }
  return str;
}
