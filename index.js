'use strict';

const reader = require('./lib/reader');
const searcher = require('./lib/searcher');
const reporter = require('./lib/reporter');

function run (directory) {
  reader.read('./package.json')
    .then(x => {
      const dependencies = searcher.searchDependencies(x);
      reader.find(directory).forEach(file => {
        reader.read(file)
          .then(lines => {
            const declarations = searcher.searchDeclarations(lines, dependencies);
            const result = searcher.searchUsage(lines, file, declarations);
            reporter.report(result);
          });
      });
    });
}

run('.');
