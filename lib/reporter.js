'use strict';

const log = require('./log-color');
const fs = require('fs');

module.exports = {
  report: report,
  fileReport: fileReport,
  unused: unused
};

function flatResult (result) {
  let resultFlattened = result.reduce((a, b) => {
    return a.concat(b);
  }, []);
  return resultFlattened;
}

function declarationsOnly (resultFlattened) {
  let declarations = resultFlattened.map((m) => {
    return m.declaration;
  });
  return declarations;
}

function groupedResult (resultFlattened, declarations) {
  let grouped = resultFlattened.reduce((grouped, r) => {
    let key = '';
    declarations.forEach(d => {
      if (r.declaration === d) {
        key = d;
      }
    });

    grouped[key] = grouped[key] || [];
    grouped[key].push(r);
    return grouped;
  }, {});
  return grouped;
}

function header (str) {
  log.red('-'.repeat(70));
  log.red(str);
  log.red('-'.repeat(70));
}

function amountMap (grouped) {
  let amount = new Map();
  Object.keys(grouped).forEach(key => {
    amount.set(key, grouped[key].length);
  });
  return amount;
}

function logFileLines (grouped) {
  Object.keys(grouped).forEach(key => {
    log.red(key + ':');
    grouped[key].forEach(x => console.log(x.file.replace('//', '/') + ':' + x.line));
  });
}

function strFileLines (grouped) {
  let content = '';
  Object.keys(grouped).forEach(key => {
    content += key + ':\n';
    grouped[key].forEach(x => {
      content += x.file.replace('//', '/') + ':' + x.line + '\n';
    });
  });
  return content;
}

function unused (declarations, dependencies) {
  const unused = new Set();
  if (declarations.length) {
    dependencies.forEach(dependency => {
      declarations.forEach(declaration => {
        if (declaration) {
          if (declaration.toUpperCase().includes(dependency.toUpperCase())) {
            unused.add(dependency);
          }
        }
      });
    });
  } else {
    dependencies.forEach(dep => {
      unused.add(dep);
    });
  }
  const unusedArray = Array.from(unused);
  const diff = dependencies.filter(x => unusedArray.indexOf(x) < 0);
  return diff.length ? diff : 'None.';
}

function jsonReporter (result, dependencies) {
  const resultFlattened = flatResult(result);
  const declarations = declarationsOnly(resultFlattened);
  const grouped = groupedResult(resultFlattened, declarations);
  const amount = amountMap(grouped);

  return {
    groups: grouped,
    declarations: declarations,
    totals: amount
  };
}

function report (result, dependencies) {
  const jsonReport = jsonReporter(result, dependencies);

  header('[ Declaration and file lines ]');
  logFileLines(jsonReport.groups);
  header('[ Declaration and amount ]');

  for (let entry of jsonReport.totals.entries()) {
    console.log(entry[0] + ' --> ' + log.applyColor(entry[1]));
  }

  header('[ Unused dependencies ]');
  log.red(unused(jsonReport.declarations, dependencies));
}

function fileReport (result, dependencies) {
  const jsonReport = jsonReporter(result, dependencies);

  let fileContent = '[ Declaration and file lines ]\n';
  fileContent += strFileLines(jsonReport.groups);
  fileContent += '\n[ Declaration and amount ]\n';

  for (let entry of jsonReport.totals.entries()) {
    fileContent += entry[0] + ' --> ' + '[' + entry[1] + ']\n';
  }

  fileContent += '\n[ Unused dependencies ]\n';
  fileContent += unused(jsonReport.declarations, dependencies);
  fs.writeFileSync('szero.txt', fileContent);
}
