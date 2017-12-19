'use strict';

const fs = require('fs');
const listJS = require('listjs');
const detective = require('detective');
const coreModules = require('node-builtins');
const validator = require('node-project-validator');

// ANSI escape code for RED.
const RED = '\x1b[31m';
// ANSI escape code for reset.
const RESET = '\x1b[39m';
// Concatenates and returns the parameter with ANSI code to reset.
const reset = s => `${s}${RESET}`;
// Log with RED color.
const logRed = s => console.log(`${RED}${reset(s)}`);

const run = (options) => {
  const dir = options.directory;

  // validates the project.
  validator.hasPackageJson(dir, true);
  validator.hasAnyDependencies(dir, true);
  validator.hasNodeModules(dir, true);

  // ignores test directory by default.
  if (!options.dev) {
    options.ignore.push('test');
  }

  // all the require() found.
  const requireSet = new Set();

  // lists JS files.
  listJS(dir, options.ignore)
    .then((files) => {
      // searches the require() for each file.
      files.forEach((f) => {
        const src = fs.readFileSync(f);
        const requires = detective(src);
        // saves the requires found in a Set to avoid duplicated results.
        requires.forEach((r) => {
          requireSet.add(r);
        });
      });

      // removes core modules from the Set.
      const withoutCoreModules = Array.from(requireSet).filter(e => !coreModules.includes(e));

      // compare with declared dependencies and display unused.
      const deps = Object.keys(require(`${dir}/package.json`).dependencies);
      const unusedDependencies = deps.filter(e => !withoutCoreModules.includes(e));
      logRed('-'.repeat(60));
      logRed('[ Unused dependencies ]');
      logRed('-'.repeat(60));
      if (unusedDependencies.length > 0) {
        unusedDependencies.forEach((e) => {
          logRed(e);
        });
        if (options.ci) {
          process.exit(1);
        }
      } else {
        logRed('None.');
      }

      if (options.dev) {
        // compare with declared devDependencies and display unused.
        const devDeps = Object.keys(require(`${dir}/package.json`).devDependencies);
        const unusedDevDependencies = devDeps.filter(e => !withoutCoreModules.includes(e));
        logRed('-'.repeat(60));
        logRed('[ Unused devDependencies ]');
        logRed('-'.repeat(60));
        if (unusedDevDependencies.length > 0) {
          unusedDevDependencies.forEach((e) => {
            logRed(e);
          });
          if (options.ci) {
            process.exit(1);
          }
        } else {
          logRed('None.');
        }
      }
      return unusedDependencies;
    })
    .catch((e) => {
      console.error(e);
    });
};

module.exports = {
  run
};
