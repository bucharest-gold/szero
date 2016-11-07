'use strict';

const Dep = require('./dep');

module.exports = {
  searchDependencies: searchDependencies,
  searchDeclarations: searchDeclarations,
  searchUsage: searchUsage,
  searchMissingDependencies: searchMissingDependencies
};

function search (lines, type) {
  let depStart = false;
  const deps = [];
  for (let l of lines) {
    if (l.includes(type)) {
      depStart = true;
    }
    if (!l.includes(type) && depStart) {
      if (l.includes('}')) {
        break;
      } else {
        deps.push(l);
      }
    }
  }
  return deps;
}

function createDep (d) {
  let name = d.split(':')[0].trim().replace(/"/g, '');
  let version = d.split(':')[1]
    .trim()
    .replace(/"/g, '')
    .replace('~', '')
    .replace('^', '')
    .replace(/,/g, '');
  return new Dep(name, version);
}

function searchDependencies (lines, includeDev) {
  const dependencies = [];
  const devDependencies = [];
  const allDeps = [];
  search(lines, 'dependencies').forEach(d => {
    dependencies.push(createDep(d));
  });
  allDeps.push(dependencies);
  if (includeDev) {
    search(lines, 'devDependencies').forEach(d => {
      dependencies.push(createDep(d));
    });
  }
  allDeps.push(devDependencies);
  return allDeps;
}

function searchDeclarations (lines, dependencies) {
  const declarations = [];
  dependencies.forEach(d => {
    lines.forEach(l => {
      if (l.includes(d.getName())) {
        let extractedRequire = getRequireFromLine(l);
        if (extractedRequire) {
          let extractedVarName = getTextFromRequire(l);
          if (extractedRequire && extractedVarName) {
            declarations.push(extractedVarName + '-' + extractedRequire);
          }
        }
      }
    });
  });
  return declarations;
}

/**
 * Plucks a require statment from a given line of code, e.g passing the line
 * "app.use(require('lib/routes'))" would return "require('lib/routes')"
 * @param  {String} l
 * @return {String|null}
 */
function getRequireFromLine (l) {
  let req = l.match(/require(.*?)\)/g);
  return req ? req[0] : null;
}

/**
 * Plucks the specific require string from a require statment, e.g given
 * "require('lib/routes')" this would return "lib/routes"
 * @param  {String} req
 * @return {String}
 */
function getTextFromRequire (req) {
  return req.match(/["'](.*?)["']/)[1];
}

function searchMissingDependencies (lines, dependencies) {
  const missingDeps = [];
  const coreModules = require('repl')._builtinLibs;
  dependencies.push(coreModules);
  lines.forEach(l => {
    if (l.includes('require(')) {
      let missing = getRequireFromLine(l);

      // Only search if not a local dependency
      if (missing && !missing.includes('/')) {
        missing = getTextFromRequire(missing).trim();

        let deps = dependencies[0].find(d => {
          return d.getName() === missing;
        });
        let devDeps = dependencies[1].find(d => {
          return d.getName() === missing;
        });
        let core = dependencies[2].find(d => {
          return d === missing;
        });
        if (!deps && !devDeps && !core) {
          missingDeps.push(missing);
        }
      }
    }
  });
  return missingDeps;
}

function searchUsage (lines, fileName, declarations) {
  const usedDeclarations = [];
  declarations = Array.from(new Set(declarations));
  declarations.forEach(d => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(d.split('-')[0] || lines[i].includes(d.split('-')[1]))) {
        let obj = {};
        obj.declaration = d;
        obj.file = fileName;
        obj.line = i + 1;
        usedDeclarations.push(obj);
      }
    }
  });
  return usedDeclarations;
}
