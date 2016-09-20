'use strict';

module.exports = {
  searchDependencies: searchDependencies,
  searchDeclarations: searchDeclarations,
  searchUsage: searchUsage
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

function searchDependencies (lines, includeDev) {
  const dependencies = new Set();
  search(lines, 'dependencies').forEach(d => {
    dependencies.add(d.split(':')[0].trim().replace(/"/g, ''));
  });
  if (includeDev) {
    search(lines, 'devDependencies').forEach(d => {
      dependencies.add(d.split(':')[0].trim().replace(/"/g, ''));
    });
  }
  return Array.from(dependencies);
}

function extractRequire (line) {
  let req = line.split('=')[1].trim();
  req = req.substring(0, req.lastIndexOf(';'));
  return req.trim();
}

function extractVarName (line) {
  let name = line.split('=')[0];
  name = name.replace('var', '');
  name = name.replace('let', '');
  name = name.replace('const', '');
  return name.trim();
}

function searchDeclarations (lines, dependencies) {
  const declarations = [];
  dependencies.forEach(d => {
    lines.forEach(l => {
      if (l.includes(d)) {
        if (l.includes('=')) {
          let extractedRequire = extractRequire(l);
          let extractedVarName = extractVarName(l);
          if (extractedRequire && extractedVarName) {
            declarations.push(extractedVarName + '-' + extractedRequire);
          }
        }
      }
    });
  });
  return declarations;
}

function searchUsage (lines, fileName, declarations) {
  const usedDeclarations = [];
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
