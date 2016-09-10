var Fidelity = require('../lib/index.js');

function resolved (value) {
  return new Fidelity(function (resolve, reject) {
    resolve(value);
  });
}

function rejected (reason) {
  return new Fidelity(function (resolve, reject) {
    reject(reason);
  });
}

module.exports = {
  resolved: resolved,
  rejected: rejected,
  deferred: Fidelity.deferred
};
