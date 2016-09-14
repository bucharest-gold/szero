'use strict';

const log = require('./log-color');

module.exports = {
  report: report,
  reportUnused: reportUnused
};

function report (result) {
  let resultFlattened = result.reduce((a, b) => {
    return a.concat(b);
  }, []);

  let declarations = resultFlattened.map((m) => {
    return m.declaration;
  });

  let grouped = resultFlattened.reduce((grouped, r) => {
    let key = '';
    declarations.forEach(d => {
      if (r.declaration === d) {
        key = d;
      }
    });
    delete r.declaration;
    grouped[key] = grouped[key] || [];
    grouped[key].push(r);
    return grouped;
  }, {});

  log.red('-'.repeat(70));
  log.red('[ Declaration and file lines ]');
  log.red('-'.repeat(70));

  let amount = new Map();
  Object.keys(grouped).forEach(key => {
    log.red(key + ':');
    grouped[key].forEach(x => console.log(x.file.replace('//', '/') + ':' + x.line));
    amount.set(key, grouped[key].length);
  });

  console.log('');
  log.red('-'.repeat(70));
  log.red('[ Declaration and amount ]');
  log.red('-'.repeat(70));

  for (let entry of amount.entries()) {
    console.log(entry[0] + ' --> ' + log.applyColor(entry[1]));
  }
}

function reportUnused (result, dependencies) {
  let resultFlattened = result.reduce((a, b) => {
    return a.concat(b);
  }, []);

  let declarations = resultFlattened.map((m) => {
    return m.declaration;
  });

  const unused = [];

  if (declarations.length) {
    dependencies.forEach(dep => {
      declarations.forEach(d => {
        if (d) {
          if (!d.includes(dep)) {
            unused.push(dep);
          }
        }
      });
    });
  } else {
    dependencies.forEach(dep => {
      unused.push(dep);
    });
  }

  log.red('-'.repeat(70));
  log.red('[ Unused dependencies ]');
  log.red('-'.repeat(70));

  console.log('');
  log.red(unused);
}
