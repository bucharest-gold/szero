'use strict';

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;
const HANDLERS = Symbol('handlers');
const QUEUE = Symbol('queue');
const STATE = Symbol('state');
const VALUE = Symbol('value');

/**
 * Represents the eventual result of an asynchronous operation.
 */
class FidelityPromise {
  /**
   * Creates a new FidelityPromise.
   * @param {function} - The executor function. It is executed immediately,
   * and should accept two resolver functions, 'resolve' and 'reject'.
   * Calling them either fulfills or rejects the promise, respectively.
   * Typically, the executor function will initiate some asynchronous task,
   * and the call 'resolve' with the result, or 'reject' if there was an error.
   */
  constructor (fn) {
    this[QUEUE] = [];
    this[HANDLERS] = new Handlers();
    this[STATE] = PENDING;
    this[VALUE] = undefined;

    const fnType = typeof fn;
    if (fnType === 'function') {
      try {
        fn(v => resolvePromise(this, v), r => transition(this, REJECTED, r));
      } catch (e) {
        transition(this, REJECTED, e);
      }
    } else if (fnType !== 'undefined') {
      resolvePromise(this, fn);
    }
  }

  /**
   * Returns the current state of this promise. Possible values are
   * `Fidelity.PENDING`, `Fidelity.FULFILLED`, or `Fidelity.REJECTED`.
   * @return the current state of this promise.
   */
  get state () {
    return this[STATE];
  }

  /**
   * Gets the current value of this promise. May be undefined.
   * @return the current value of this promise
   */
  get value () {
    return this[VALUE];
  }

  /**
   * Follows the [Promises/A+](https://promisesaplus.com/) spec
   * for a `then` function.
   * @return {FidelityPromise}
   */
  then (onFulfilled, onRejected) {
    const next = new FidelityPromise();
    if (typeof onFulfilled === 'function') {
      next[HANDLERS].fulfill = onFulfilled;
    }
    if (typeof onRejected === 'function') {
      next[HANDLERS].reject = onRejected;
    }
    this[QUEUE].push(next);
    process(this);
    return next;
  }

  /**
   * Syntactic sugar for `this.then(null, onRejected)`.
   * @return {FidelityPromise}
   */
  catch (onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * Creates a promise that will be resolved or rejected at some time
   * in the future.
   * @param {function} fn The function that will do the work of this promise.
   * The function is passed two function arguments, `resolve()` and `reject()`.
   * Call one of these when the work has completed (or failed).
   * @returns {FidelityPromise} A promise object
   * @deprecated Use new FidelityPromise()
   */
  static promise (fn) {
    console.error('Fidelity.promise() is deprecated. Use `new Fidelity.Promise()`.');
    return new FidelityPromise(fn);
  }

  /**
   * Creates a `deferred` object, containing a promise which may
   * be resolved or rejected at some point in the future.
   * @returns {object} deferred The deferred object
   * @returns {function} deferred.resolve(value) The resolve function
   * @returns {function} deferred.reject(cause) The reject function
   * @returns {object} deferred.promise The inner promise object
   */
  static deferred () {
    var resolver;
    var rejecter;
    var p = new FidelityPromise((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });

    function resolve (value) {
      resolver(value);
    }

    function reject (cause) {
      rejecter(cause);
    }

    return {
      promise: p,
      resolve: resolve,
      reject: reject
    };
  }

  /**
   * Returns a promise that is resolved with `value`.
   * @param {any} value The value to resolve the returned promise with
   * @returns {FidelityPromise} A promise resolved with `value`
   */
  static resolve (value) {
    if (value && value.then) return value;

    switch (value) {
      case null:
        return NULL;
      case true:
        return TRUE;
      case false:
        return FALSE;
      case 0:
        return ZERO;
      case '':
        return EMPTYSTRING;
    }

    const p = new FidelityPromise();
    p[STATE] = FULFILLED;
    p[VALUE] = value;
    return p;
  }
}

FidelityPromise.PENDING = PENDING;
FidelityPromise.FULFILLED = FULFILLED;
FidelityPromise.REJECTED = REJECTED;

class Handlers {
  constructor () {
    this.fulfill = null;
    this.reject = null;
  }
}

const TRUE = new FidelityPromise(true);
const FALSE = new FidelityPromise(false);
const NULL = new FidelityPromise(null);
const ZERO = new FidelityPromise(0);
const EMPTYSTRING = new FidelityPromise('');

/**
 * @module fidelity
*/
module.exports = FidelityPromise;

function resolvePromise (p, x) {
  if (x === p) {
    transition(p, REJECTED, new TypeError('The promise and its value are the same.'));
    return;
  }

  if (x && ((typeof x === 'function') || (typeof x === 'object'))) {
    let called = false;
    let thenFunction;
    try {
      thenFunction = x.then;
      if (thenFunction && (typeof thenFunction === 'function')) {
        thenFunction.call(x, (y) => {
          if (!called) {
            resolvePromise(p, y);
            called = true;
          }
        }, (r) => {
          if (!called) {
            transition(p, REJECTED, r);
            called = true;
          }
        });
      } else {
        transition(p, FULFILLED, x);
        called = true;
      }
    } catch (e) {
      if (!called) {
        transition(p, REJECTED, e);
        called = true;
      }
    }
  } else {
    transition(p, FULFILLED, x);
  }
}

function process (p) {
  if (p[STATE] === PENDING) return;
  global.process.nextTick(() => {
    let qp, handler, value;
    while (p[QUEUE].length) {
      qp = p[QUEUE].shift();
      if (p[STATE] === FULFILLED) {
        handler = qp[HANDLERS].fulfill || ((v) => v);
      } else if (p[STATE] === REJECTED) {
        handler = qp[HANDLERS].reject || ((r) => {
          throw r;
        });
      }
      try {
        value = handler(p[VALUE]);
      } catch (e) {
        transition(qp, REJECTED, e);
        continue;
      }
      resolvePromise(qp, value);
    }
  });
  return p;
}

function transition (p, state, value) {
  if (p[STATE] === state ||
    p[STATE] !== PENDING ||
    arguments.length !== 3) return;
  p[STATE] = state;
  p[VALUE] = value;
  return process(p);
}
