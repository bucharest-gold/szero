'use strict';

const Fidelity = require('../lib/index.js');
const Bluebird = require('bluebird');
const PromiseModule = require('promise');
const Q = require('q');
const profiler = require('v8-profiler');
const fs = require('fs');

let profilerRunning = false;

function toggleProfiling () {
  if (profilerRunning) {
    const profile = profiler.stopProfiling();
    console.log('stopped profiling');
    profile.export()
      .pipe(fs.createWriteStream('./fidelity-' + Date.now() + '.cpuprofile'))
      .once('error', profiler.deleteAllProfiles)
      .once('finish', profiler.deleteAllProfiles);
    profilerRunning = false;
    return;
  }
  profiler.startProfiling();
  profilerRunning = true;
  console.log('started profiling');
}

console.log('PID', process.pid);
process.on('SIGUSR2', toggleProfiling);

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function newNativePromise () {
  return new Promise((resolve, reject) => {
    resolve(getRandomInt(0, 10));
  });
}

function nativePromiseResolve () {
  return Promise.resolve(getRandomInt(0,10));
}

function fidelityResolve () {
  return Fidelity.resolve(getRandomInt(0,10));
}

function fidelityPromise () {
  return new Fidelity((resolve, reject) => {
    resolve(getRandomInt(0,10));
  });
}

function bluebirdPromise () {
  return Bluebird.resolve(getRandomInt(0,10));
}

function QPromise () {
  return Q(getRandomInt(0,10));
}

function PromiseModuleResolve () {
  return PromiseModule.resolve(getRandomInt(0,10));
}

function PromiseModuleNewPromise () {
  return new PromiseModule((resolve, reject) => {
    resolve(getRandomInt(0,10));
  });
}

function runBenchmarks () {
  exports.compare = {
    "new Promise()" : function (done) {
      newNativePromise().then(done);
    },
    "native Promise.resolve" : function (done) {
      nativePromiseResolve().then(done);
    },
    "new Fidelity.Promise" : function(done) {
      fidelityPromise().then(done);
    },
    "Fidelity.resolve" : function(done) {
      fidelityResolve().then(done);
    },
    "Bluebird.resolve" : function (done) {
      bluebirdPromise().then(done);
    },
    "Q()" : function (done) {
      QPromise().then(done);
    },
    "PromiseModule.resolve" : function (done) {
      PromiseModuleResolve().then(done);
    },
    "new PromiseModule()" : function (done) {
      PromiseModuleNewPromise().then(done);
    }
  };

  exports.time = 1000;
  require('bench').runMain();
}
runBenchmarks();

