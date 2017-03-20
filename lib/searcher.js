'use strict';

const Dependency = require('./dependency');
const coreModules = require('node-builtins');
const fs = require('fs');

function search (lines, type) {
  let depStart = false;
  const deps = [];
  for (const l of lines) {
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
  const name = d.split(':')[0].trim().replace(/"/g, '');
  const version = d.split(':')[1]
    .trim()
    .replace(/"/g, '')
    .replace('~', '')
    .replace('^', '')
    .replace(/,/g, '');
  return new Dependency(name, version);
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
 * Plucks a require statment from a given line of code, e.g passing the line
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

function isGoodDirectory (dir, ignore) {
  const byDefault = !dir.includes('node_modules') &&
    !dir.includes('coverage') &&
    !dir.includes('doc') &&
    !dir.includes('.git') &&
    !dir.includes('dist') &&
    !dir.includes('docs');
  if (ignore) {
    let ignoreNotFound = true;
    ignore.forEach((i) => {
      if (dir.includes(i)) {
        ignoreNotFound = false;
        return;
      }
    });
    return byDefault && ignoreNotFound;
  } else {
    return byDefault;
  }
}

function searchJsFiles (dir, list, ignore) {
  let jsFiles = list || [];
  const files = fs.readdirSync(dir);
  files.forEach((f) => {
    if (isGoodDirectory(dir, ignore)) {
      if (fs.statSync(`${dir}/${f}`).isDirectory()) {
        jsFiles = searchJsFiles(`${dir}/${f}`, jsFiles, ignore);
      } else if (f.endsWith('.js')) {
        jsFiles.push(`${dir}/${f}`);
      }
    }
  });
  return jsFiles;
}

module.exports = {
  searchDependencies,
  searchDeclarations,
  searchUsage,
  searchMissingDependencies,
  searchRequires,
  searchJsFiles
};
