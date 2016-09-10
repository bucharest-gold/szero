'use strict';

const LineByLineReader = require('line-by-line');
const Fidelity = require('fidelity');

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

function grabDependencies(lines) {
  let depStart = false;
  const deps = [];
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
  return deps;
}

readFile('./package.json')
.then(x => {
  console.log(grabDependencies(x));
});

// 1. read package.json
// 1.1 locate and store dependencies names
// 2. read a .js file
// 3. search for 'require('depname')' and relate this to const, let or var name
// 4. search this ^ on 2.
// 5. report the usage on lines

// report :
// =========

// roi is used on :

// mysuper.js line 80
// mysuper.js line 95
// urbandictionarycli.js line 29
