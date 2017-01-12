'use strict';

/**
 * This class is just hold name and version of the dependency.
 */
class Dep {

  constructor (n, v) {
    this.name = n;
    this.version = v;
  }

  static get name () {
    return this.name;
  }

  static get version () {
    return this.version;
  }

}

module.exports = Dep;
