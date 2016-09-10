# [![Promises/A+](https://promisesaplus.com/assets/logo-small.png)](https://promisesaplus.com) Fidelity

[![Build Status](https://travis-ci.org/bucharest-gold/fidelity.svg?branch=master)](https://travis-ci.org/bucharest-gold/fidelity)

[![NPM](https://nodei.co/npm/fidelity.png)](https://npmjs.org/package/fidelity)

A fast and simple Promise/A+ implementation.

> _Node.js 4,5,6_

## Installing

`npm install fidelity`

## Usage

A fidelity promise behaves according to the
[Promises/A+ specification](https://promisesaplus.com/). If you haven't read it,
it's worth your time and will probably make all of the fidelity documentation clearer.

You can create promises using the exported constructor.

    const Fidelity = require('fidelity');
    new Fidelity( (resolve, reject) => {
      // etc.
    } )

You call the constructor function with an executor function as the only parameter. Typically this
function will perform some asynchronous task, and when that task has completed it will
resolve or reject the promise depending on whether or not the task completed successfully.

The executor function takes two function parameters: `resolve` and `reject`. These functions are
used to resolve or reject the promise as needed.

Suppose we have a function, `someAsyncFunction()` that takes some time to complete asynchronously.
We can call this function using a promise.

    const Fidelity = require('fidelity');

    new Fidelity( (resolve, reject) => {
      someAsyncFunction((result, err) => {
        if (err) {
          reject(err); // The function produced an error. Reject the promise
        } else {
          resolve(result); // Fulfill the promise with the result
        }
      });
    })
    .then( (val) => {
      // This code executes after a promise has been fulfilled
      // Do something with the result.
    })
    .catch( (err) => {
      // This code executes if the promise  was rejected
    });

### Promise states

A promise will only ever be in one of three states. `Fidelity.PENDING`,
`Fidelity.FULFILLED` or `Fidelity.REJECTED`.

## API

Generated documentation can be found here: http://bucharest-gold.github.io/fidelity.

### Fidelity

The `fidelity` module exports a constructor function for a Fidelity promise.

    const Fidelity = require('fidelity');

### new Fidelity(func)

A constructor function that creates and returns a promise. The `func` parameter is a function
that accepts a `resolve` and `reject` function.

### Fidelity#then(onFulfilled, onRejected)

The 'then' function takes two function arguments. The first, `onFulfilled`,
is called with the return value (if any) of the promise function if it is
successfully fulfilled. The second function, `onRejected` is called in the
event of an error. A `promise` is returned in either case.

    p.then( (result) => {
      console.log('sucessful result ', result);
    }, (err) => {
      console.error('whoops!', err);
    });

### Fidelity#catch(onRejected)

This is just a little syntactic sugar for `promise.then(null, onRejected);`.
It returns a `promise`.

### Fidelity.resolve(value)

A static utility function that returns a promise which has been resolved
with the provided `value`.

### Fidelity.deferred()

 A static utility function that Creates and returns a `deferred` object.
 Deferred objects contain a promise which may
 be resolved or rejected at some point in the future.

 An example.

    const deferred = Fidelity.deferred();

    callSomeAsyncFunction((err, result) => {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    });

### Fidelity.deferred().resolve(value)

 Resolves the deferred promise with `value`.

### Fidelity.deferred().reject(cause)

Rejects the deferred promise with `cause`.

### Fidelity.deferred().promise

The deferred promise.

## Testing

This module passes all of the tests in the
[Promises/A+ Compliance Test Suite](https://github.com/promises-aplus/promises-tests).
To run the full suite of the Promises/A+ spec, just `npm test` from the command line.

## Benchmarks

It's pretty fast. Benchmarks are notoriously
a lot like [statistics](https://en.wikipedia.org/wiki/Lies,_damned_lies,_and_statistics)
so take this with a grain of salt. Results from a simplified, non-scientific benchmark
performed on a Macbook Pro on a random Tuesday afternoon. Your results may vary.

    ~/s/fidelity git:master ❮❮❮ npm run benchmark                                         ⏎ ⬆ ✭ ✱

    > fidelity@3.0.1 benchmark /Users/lanceball/src/fidelity
    > node benchmark/benchmark.js

    benchmarking /Users/lanceball/src/fidelity/benchmark/benchmark.js
    Please be patient.
    { http_parser: '2.7.0',
      node: '6.4.0',
      v8: '5.0.71.60',
      uv: '1.9.1',
      zlib: '1.2.8',
      ares: '1.10.1-DEV',
      icu: '57.1',
      modules: '48',
      openssl: '1.0.2h' }
    Scores: (bigger is better)

    PromiseModule.resolve
    Raw:
    > 1555.3626373626373
    > 1401.2167832167831
    > 1327.6563436563436
    > 1393.0969030969031
    Average (mean) 1419.3331668331666

    new PromiseModule()
    Raw:
    > 1365.4745254745255
    > 1343.7552447552448
    > 1191.027972027972
    > 1181.5374625374625
    Average (mean) 1270.4488011988012

    Fidelity.resolve
    Raw:
    > 933.9120879120879
    > 896.8631368631369
    > 870.8951048951049
    > 922.7932067932068
    Average (mean) 906.1158841158842

    Fidelity.promise
    Raw:
    > 785.4055944055945
    > 777.1188811188811
    > 712.4645354645355
    > 734.8341658341658
    Average (mean) 752.4557942057943

    native Promise.resolve
    Raw:
    > 420.1108891108891
    > 426.6373626373626
    > 403.24175824175825
    > 405.8771228771229
    Average (mean) 413.96678321678326

    Bluebird.resolve
    Raw:
    > 441.4175824175824
    > 401.4165834165834
    > 399.82917082917083
    > 410.04495504495503
    Average (mean) 413.1770729270729

    new Promise()
    Raw:
    > 396.83116883116884
    > 374.0979020979021
    > 368.3986013986014
    > 397.9230769230769
    Average (mean) 384.3126873126873

    Q()
    Raw:
    > 145.3106893106893
    > 141.88645418326692
    > 138.93106893106892
    > 137.1878121878122
    Average (mean) 140.82900615320932

    Winner: PromiseModule.resolve
    Compared with next highest (new PromiseModule()), it's:
    10.49% faster
    1.12 times as fast
    0.05 order(s) of magnitude faster
    A LITTLE FASTER

    Compared with the slowest (Q()), it's:
    90.08% faster
    10.08 times as fast
    1 order(s) of magnitude faster
