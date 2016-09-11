'use strict';

module.exports = {
  report: report
};

const RED = '\x1b[31m';
const COLOR_BACK = '\x1b[39m';

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

  console.log(RED, '-'.repeat(70), COLOR_BACK);
  console.log(RED, 'Dependency search results: ', COLOR_BACK);
  console.log(RED, '-'.repeat(70), COLOR_BACK);

  let amount = new Map();
  Object.keys(grouped).forEach(key => {
    console.log(RED + key + ':', COLOR_BACK);
    console.log(grouped[key]);
    amount.set(key, grouped[key].length);
  });

  console.log('');

  console.log(RED, '-'.repeat(70), COLOR_BACK);
  console.log(RED, 'How much used: ', COLOR_BACK);
  console.log(RED, '-'.repeat(70), COLOR_BACK);

  for (let entry of amount.entries()) {
    let x = entry[1];
    if (x === 1) {
      x = RED + '[ ' + x + ' ]' + COLOR_BACK;
    } else {
      x = '[ ' + x + ' ]';
    }
    console.log(entry[0] + '--> ' + x);
  }
}
