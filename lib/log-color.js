'use strict';

// ANSI escape code for RED.
const RED = '\x1b[31m';
// ANSI escape code for GREEN.
const GREEN = '\x1b[32m';
// ANSI escape code for YELLOW.
const YELLOW = '\x1b[33m';
// ANSI escape code for MAGENTA.
const MAGENTA = '\x1b[35m';
// ANSI escape code for reset.
const RESET = '\x1b[39m';

// Concatenates and returns the parameter with ANSI code to reset.
const reset = s => `${s}${RESET}`;
// Log with RED color.
const red = s => console.log(`${RED}${reset(s)}`);
// Log with GREEN color.
const green = s => console.log(`${GREEN}${reset(s)}`);
// Log with MAGENTA color.
const magenta = s => console.log(`${MAGENTA}${reset(s)}`);
// Log with YELLOW color.
const yellow = s => console.log(`${YELLOW}${reset(s)}`);

// This function expression apply a color
// to a number depending of the value.
// 1 - red, 2 - yellow and green if the number is > 2.
const applyColor = (n) => {
  let coloredResult = '';
  if (n === 1) {
    coloredResult = `${RED}[ ${n} ]${RESET}`;
  } else if (n === 2) {
    coloredResult = `${YELLOW}[ ${n} ]${RESET}`;
  } else {
    coloredResult = `${GREEN}[ ${n} ]${RESET}`;
  }
  return coloredResult;
};

module.exports = { red, green, yellow, magenta, applyColor };
