'use strict';

module.exports = {
  read: read,
  find: find
};

const LineByLineReader = require('line-by-line');
const Fidelity = require('fidelity');

function read (file) {
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

function find (dir, list) {
  let fs = require('fs');
  let files = fs.readdirSync(dir);
  list = list || [];
  files.forEach(f => {
    // TODO: extract this.
    if (!dir.includes('node_modules') &&
        !dir.includes('test') &&
        !dir.includes('tests')) {
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
