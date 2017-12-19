'use strict';

const Dependency = require('./dependency');
const coreModules = require('node-builtins');

function createDep (name, v) {
  const version = v.trim()
    .replace(/"/g, '')
    .replace('~', '')
    .replace('^', '')
    .replace(/,/g, '');
  return new Dependency(name, version);
}

function searchDependencies (json, includeDev) {
  const allDeps = [];
  if (json.dependencies) {
    allDeps.push(
      Object.keys(json.dependencies)
        .map(key => createDep(key, json.dependencies[key])));
  } else {
    allDeps.push([]);
  }
  if (includeDev && json.devDependencies) {
    allDeps.push(
      Object.keys(json.devDependencies)
        .map(key => createDep(key, json.devDependencies[key])));
  } else {
    allDeps.push([]);
  }
  return allDeps;
}

function searchDeclarations (lines, dependencies) {
  const declarations = [];
  dependencies.forEach(d => {
    lines.forEach(l => {
      if (l.includes(d.name)) {
        const extractedRequire = getRequireFromLine(l);
        if (extractedRequire) {
          const extractedVarName = getTextFromRequire(l);
          if (extractedRequire && extractedVarName) {
            declarations.push(`${extractedVarName}-${extractedRequire}`);
          }
        }
      }
    });
  });
  return declarations;
}

function searchRequires (lines) {
  const requires = [];
  lines.forEach(l => {
    const require = getRequireFromLine(l);
    if (require) {
      requires.push(require);
    }
  });
  return requires;
}

/**
 * Plucks a require statement from a given line of code, e.g passing the line
 * "app.use(require('lib/routes'))" would return "require('lib/routes')"
 * @param  {String} l
 * @return {String|null}
 */
function getRequireFromLine (l) {
  if (l.indexOf('required') > 0) return null;
  const req = l.match(/require(.*?)\)/g);
  return req ? req[0] : null;
}

/**
 * Plucks the specific require string from a require statement, e.g given
 * "require('lib/routes')" this would return "lib/routes"
 * @param  {String} req
 * @return {String}
 */
function getTextFromRequire (req) {
  const match = req.match(/["'](.*?)["']/);
  if (match && match.length >= 1) {
    return match[1];
  } else {
    return null;
  }
}

function searchMissingDependencies (lines, dependencies) {
  const missingDeps = [];
  dependencies.push(coreModules);
  lines.forEach(l => {
    if (l.includes('require(')) {
      let missing = getRequireFromLine(l);

      // Only search if not a local dependency
      if (missing && !missing.includes('/')) {
        missing = getTextFromRequire(missing).trim();

        const deps = dependencies[0].find(d => {
          return d.name === missing;
        });
        const devDeps = dependencies[1].find(d => {
          return d.name === missing;
        });
        const core = dependencies[2].find(d => {
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
        const obj = {};
        obj.declaration = d;
        obj.file = fileName;
        obj.line = i + 1;
        usedDeclarations.push(obj);
      }
    }
  });
  return usedDeclarations;
}

module.exports = {
  searchDependencies,
  searchDeclarations,
  searchUsage,
  searchMissingDependencies,
  searchRequires,
  getTextFromRequire
};
