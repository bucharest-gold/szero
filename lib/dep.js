'use strict';

class Dep {

  constructor (name, version) {
    this.name = name;
    this.version = version;
  }

  getName () {
    return this.name;
  }

  getVersion () {
    return this.version;
  }
}

module.exports = Dep;
