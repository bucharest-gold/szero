'use strict';

module.exports = {
  read: read,
  find: find
};

const fs = require('fs');

function read (file) {
  const lines = [];
  stripComments(fs.readFileSync(file).toString()).split('\n').forEach(line => {
    lines.push(line);
  });
  return lines;
}

function stripComments (element) {
  let stripped = element.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
  return stripped;
}

function goodDirectory (dir) {
  return !dir.includes('node_modules') &&
    !dir.includes('coverage') &&
    !dir.includes('doc') &&
    !dir.includes('docs');
}

function find (dir, list) {
  let fs = require('fs');
  let files = fs.readdirSync(dir);
  list = list || [];
  files.forEach(f => {
    if (goodDirectory(dir)) {
      if (fs.statSync(dir + '/' + f).isDirectory()) {
        list = find(dir + '/' + f, list);
      } else {
        if (f.endsWith('.js')) {
          list.push(dir + '/' + f);
        }
      }
    }
  });
  return list;
}
