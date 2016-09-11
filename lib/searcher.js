'use strict';

module.exports = {
  searchDependencies: searchDependencies,
  searchDeclarations: searchDeclarations,
  searchUsage: searchUsage
};

function searchDependencies (lines) {
  let depStart = false;
  const deps = [];
  const dependencies = [];

  for (let l of lines) {
    if (l.includes('dependencies')) {
      depStart = true;
    }
    if (!l.includes('dependencies') && depStart) {
      if (l.includes('}')) {
        break;
      } else {
        deps.push(l);
      }
    }
  }

  deps.forEach(d => {
    dependencies.push(d.split(':')[0].trim().replace(/"/g, ''));
  });

  return dependencies;
}

function searchDeclarations (lines, dependencies) {
  const result = [];
  dependencies.forEach(d => {
    lines.forEach(l => {
      if (l.includes(d)) {
        if (l.includes('=')) {
          let req = l.split('=')[1].trim();
          req = req.substring(0, req.lastIndexOf(';'));
          result.push(req);
          let varName = l.split('=')[0];
          varName = varName.replace('var', '');
          varName = varName.replace('let', '');
          varName = varName.replace('const', '');
          varName = varName.trim();
          result.push(varName);
        }
      }
    });
  });
  return result;
}

function searchUsage (fileContent, fileName, declarations) {
  const result = [];
  for (let d of declarations) {
    for (let i = 0; i < fileContent.length; i++) {
      if (fileContent[i].includes(d)) {
        let obj = {};
        obj.declaration = d;
        obj.file = fileName;
        obj.line = i + 1;
        result.push(obj);
      }
    }
  }
  return result;
}
