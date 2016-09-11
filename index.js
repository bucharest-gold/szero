'use strict';

const LineByLineReader = require('line-by-line');
const Fidelity = require('fidelity');

let dependencies = [];
let requires = [];
let varNames = [];

let reportRequire = [];
let reportVarNames = [];

function readFile (file) {
  return new Fidelity((resolve, reject) => {
    const lbl = new LineByLineReader(file);
    let lines = [];

    lbl.on('line', line => {
      lines.push(line);
    });

    lbl.on('end', () => {
      resolve(lines);
    });
  });
}

function grabDepNames (lines) {
  let depStart = false;
  const deps = [];
  const depsNames = [];
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
    depsNames.push(d.split(':')[0].trim().replace(/"/g, ''));
  });
  return depsNames;
}

function grabRequireAndVarNames (lines) {
  for (let d of dependencies) {
    for (let l of lines) {
      if (l.includes(d)) {
        if (l.includes('=')) {
          let req = l.split('=')[1].trim();
          req = req.substring(0, req.lastIndexOf(';'));
          requires.push(req);
          let varName = l.split('=')[0];
          varName = varName.replace('var', '');
          varName = varName.replace('let', '');
          varName = varName.replace('const', '');
          varName = varName.trim();
          varNames.push(varName);
        }
      }
    }
  }
}

function findAllFiles (dir, list) {
  let fs = require('fs');
  let files = fs.readdirSync(dir);
  list = list || [];
  files.forEach(f => {
    if (!dir.includes('node_modules')) {
      if (fs.statSync(dir + '/' + f).isDirectory()) {
        list = findAllFiles(dir + '/' + f, list);
      } else {
        if (f.endsWith('.js')) {
          list.push(dir + '/' + f);
        }
      }
    }
  });
  return list;
}

function report () {
  console.log(reportRequire);
  console.log(reportVarNames);
}

function searchRequireUsage (arrayLines, f) {
  for (let r of requires) {
    for (let i = 0; i < arrayLines.length; i++) {
      if (arrayLines[i].includes(r)) {
        let obj = {
          req: '',
          file: '',
          line: 0
        };
        obj.req = r;
        obj.file = f;
        obj.line = i + 1;
        reportRequire.push(obj);
      }
    }
  }

  for (let v of varNames) {
    for (let i = 0; i < arrayLines.length; i++) {
      if (arrayLines[i].includes(v)) {
        let obj = {
          varName: '',
          file: '',
          line: 0
        };
        obj.varName = v;
        obj.file = f;
        obj.line = i + 1;
        reportVarNames.push(obj);
      }
    }
  }
}

readFile('./package.json')
  .then(x => {
    dependencies = grabDepNames(x);
    findAllFiles('.').forEach(f => {
      readFile(f)
        .then(x => {
          grabRequireAndVarNames(x);
          searchRequireUsage(x, f);
          report();
        });
    });
  });
