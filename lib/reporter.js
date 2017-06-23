'use strict';

const roi = require('roi');
const log = require('./log-color');
const fs = require('fs');
const os = require('os');

function groupedResult (resultFlattened, declarations) {
  const grouped = resultFlattened.reduce((grouped, r) => {
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
  const amount = new Map();
  Object.keys(grouped).forEach(key => {
    amount.set(key, grouped[key].length);
  });
  return amount;
}

function logFileLines (grouped) {
  Object.keys(grouped).forEach(key => {
    log.red(`${key}:`);
    grouped[key].forEach(value => {
      console.log(`${value.file.replace('//', '/')}:${value.line}`);
    });
  });
}

function strFileLines (grouped) {
  let content = '';
  Object.keys(grouped).forEach(key => {
    content += `${key}:${os.EOL}`;
    grouped[key].forEach(value => {
      content += `${value.file.replace('//', '/')}:${value.line}${os.EOL}`;
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
          if (declaration.toUpperCase().includes(dependency.name.toUpperCase())) {
            unused.add(dependency.name);
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
  const diff = dependencies.filter(d => unusedArray.indexOf(d.name) < 0);
  return diff.length ? diff : 'None.';
}

function jsonReport (result, dependencies, requires) {
  const resultFlattened = result.reduce((a, b) => { return a.concat(b); }, []);
  const declarations = resultFlattened.map((m) => { return m.declaration; });
  const grouped = groupedResult(resultFlattened, declarations);
  const amount = amountMap(grouped);
  const unusedDeps = unused(declarations, dependencies[0]);

  return {
    groups: grouped,
    dependencies: dependencies[0],
    devDependencies: dependencies[1],
    declarations: declarations,
    unused: unusedDeps,
    totals: amount,
    requires: requires
  };
}

function licenseReporter (dependencies) {
  return Promise.resolve().then(() => {
    const licensePromises = dependencies.map(d => {
      return roi.get({endpoint: `http://registry.npmjs.org/${d.name}/${d.version}`});
    });

    return Promise.all(licensePromises).then((results) => {
      return results.map((r) => {
        const body = JSON.parse(r.body);
        if (body.licenses) {
          if (body.licenses.type) {
            body.license = body.licenses.map(l => l.type);
          }
        } else if (typeof body.license !== 'string') {
          // See: https://docs.npmjs.com/files/package.json#license
          if (body.license && body.license.type) {
            body.license = body.license.type;
          }
        }
        return {
          name: body.name,
          license: body.license
        };
      });
    });
  });
}

function consoleReport (jsonReport, options) {
  options = options || {};
  header('[ Declaration and file lines ]');
  logFileLines(jsonReport.groups);
  header('[ Declaration and amount ]');

  for (const entry of jsonReport.totals.entries()) {
    console.log(`${entry[0]} --> ${log.applyColor(entry[1])}`);
  }

  header('[ Unused dependencies ]');
  if (Array.isArray(jsonReport.unused)) {
    jsonReport.unused.forEach(d => {
      log.red(d.name);
    });
  } else {
    log.red(jsonReport.unused);
  }

  if (jsonReport.devDependencies.length) {
    header('[ Dev dependencies ]');
    log.red(jsonReport.devDependencies);
  }

  if (jsonReport.requires) {
    header('[ Requires ]');
    Array.from(jsonReport.requires).sort().forEach(req => log.yellow(req));
    log.yellow(`Require count --> ${jsonReport.requires.size}`);
  }

  if (options.license) {
    header('[ Licenses ]');
    licenseReporter(jsonReport.dependencies).then((results) => {
      results.forEach(d => {
        log.magenta(`${d.name} --> ${d.license}`);
      });
    }).catch((err) => {
      log.magenta(`There was an error retrieving the licenses ${err}`);
    });
  }
}

function createFileReport (jsonReport, options) {
  return new Promise((resolve, reject) => {
    options = options || {};
    let fileContent = `[ Declaration and file lines ]${os.EOL}`;
    fileContent += strFileLines(jsonReport.groups);
    fileContent += `${os.EOL}[ Declaration and amount ]${os.EOL}`;

    for (const entry of jsonReport.totals.entries()) {
      fileContent += `${entry[0]} --> [${entry[1]}]${os.EOL}`;
    }

    fileContent += `${os.EOL}[ Unused dependencies ]${os.EOL}`;
    fileContent += jsonReport.unused;

    if (jsonReport.devDependencies.length) {
      fileContent += `${os.EOL}[ Dev dependencies ]${os.EOL}`;
      fileContent += jsonReport.devDependencies;
    }

    if (options.license) {
      fileContent += `${os.EOL}[ Licenses ]${os.EOL}`;
      licenseReporter(jsonReport.dependencies).then((results) => {
        results.forEach(d => {
          fileContent += `${d.name} --> ${d.license}${os.EOL}`;
        });
        return resolve(fileContent);
      }).catch((err) => {
        fileContent += `There was an error retrieving the licenses ${err}`;
        return resolve(fileContent);
      });
    } else {
      return resolve(fileContent);
    }
  });
}

function fileReport (jsonReport, options) {
  options = options || {};
  return createFileReport(jsonReport, options).then((fileContent) => {
    const filename = options.filename || 'szero.txt';
    fs.writeFileSync(filename, fileContent);
  });
}

function summary (jsonReport, missing) {
  header('[ Unused dependencies ]');
  log.red(jsonReport.unused.map(dependency => dependency.name));

  header('[ Missing dependencies ]');
  if (missing && missing.length) {
    log.red(missing);
  } else {
    log.red('None.');
  }
}

module.exports = {
  jsonReport,
  licenseReport: licenseReporter,
  consoleReport,
  createFileReport,
  fileReport,
  unused,
  summary
};
