'use strict';

const fs = require('fs');
const listJS = require('listjs');
const detective = require('detective');
const coreModules = require('node-builtins');
const validator = require('node-project-validator');
const licenseReporter = require('license-reporter');

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
      console.log('-'.repeat(60));
      console.log('[ Unused dependencies ]');
      console.log('-'.repeat(60));
      if (unusedDependencies.length > 0) {
        unusedDependencies.forEach((e) => {
          console.log(e);
        });
        if (options.ci) {
          process.exit(1);
        }
      } else {
        console.log('None.');
      }

      if (options.dev) {
        // compare with declared devDependencies and display unused.
        const devDeps = Object.keys(require(`${dir}/package.json`).devDependencies);
        const unusedDevDependencies = devDeps.filter(e => !withoutCoreModules.includes(e));
        console.log('-'.repeat(60));
        console.log('[ Unused devDependencies ]');
        console.log('-'.repeat(60));
        if (unusedDevDependencies.length > 0) {
          unusedDevDependencies.forEach((e) => {
            console.log(e);
          });
          if (options.ci) {
            process.exit(1);
          }
        } else {
          logRed('None.');
        }
      }

      if (options.license) {
        console.log('-'.repeat(60));
        console.log('[ Licenses ]');
        console.log('-'.repeat(60));
        licenseReporter.licenses(dir, false, true);
      }
    })
    .catch((e) => {
      console.error(e);
    });
};

module.exports = {
  run
};
