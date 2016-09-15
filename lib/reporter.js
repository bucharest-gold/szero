'use strict';

const log = require('./log-color');
const fs = require('fs');

module.exports = {
  report: report,
  fileReport: fileReport
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
    delete r.declaration;
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
  return unused;
}

function report (result, dependencies) {
  let resultFlattened = flatResult(result);
  let declarations = declarationsOnly(resultFlattened);
  let grouped = groupedResult(resultFlattened, declarations);

  header('[ Declaration and file lines ]');
  logFileLines(grouped);
  header('[ Declaration and amount ]');

  let amount = amountMap(grouped);
  for (let entry of amount.entries()) {
    console.log(entry[0] + ' --> ' + log.applyColor(entry[1]));
  }

  header('[ Unused dependencies ]');
  log.red(unused(declarations, dependencies));
}

function fileReport (result, dependencies) {
  let resultFlattened = flatResult(result);
  let declarations = declarationsOnly(resultFlattened);
  let grouped = groupedResult(resultFlattened, declarations);

  let fileContent = '[ Declaration and file lines ]\n';
  fileContent += strFileLines(grouped);
  fileContent += '\n[ Declaration and amount ]\n';

  let amount = amountMap(grouped);
  for (let entry of amount.entries()) {
    fileContent += entry[0] + ' --> ' + '[' + entry[1] + ']\n';
  }

  fileContent += '\n[ Unused dependencies ]\n';
  fileContent += unused(declarations, dependencies);
  fs.writeFileSync('szero.txt', fileContent);
}
