# szero

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/szero/badge.svg)](https://coveralls.io/github/bucharest-gold/szero)
[![Build Status](https://travis-ci.org/bucharest-gold/szero.svg?branch=master)](https://travis-ci.org/bucharest-gold/szero)
[![Known Vulnerabilities](https://snyk.io/test/npm/szero/badge.svg)](https://snyk.io/test/npm/szero)
[![dependencies Status](https://david-dm.org/bucharest-gold/szero/status.svg)](https://david-dm.org/bucharest-gold/szero)

[![NPM](https://nodei.co/npm/szero.png)](https://npmjs.org/package/szero)

Sub Zero dependency search.

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0 |
| Build:          | make |
| Documentation:  | N/A |
| Issue tracker:  | https://github.com/bucharest-gold/szero/issues |
| Engines:        | Node.js 4.x, 5.x, 6.x |

## Installation

    npm install szero -g

## Usage

    $ szero /path_to/project  (or use '.' for current directory)
    $ szero .
    $ szero . --ci  ('break the build' if unused dependencies found)
    $ szero . --file (report the result to a file)
    $ szero . --dev (enables devDependencies search).
    $ szero . --file --dev
    $ szero . --summary  (shows only unused and missing dependencies)
    $ szero --help (shows help and usage)
    $ szero --version (shows szero's version)

![out.gif](https://raw.githubusercontent.com/bucharest-gold/szero/master/out.gif)

![a.png](https://raw.githubusercontent.com/bucharest-gold/szero/master/a.png)

The default output is to the console, but you can specify a "reporter" of file to also output the results to a file called szero.txt

    $szero /path_to/myproject --file

### Programmatic API

To use the `szero` api in code, first install it locally

    $ npm install szero --save

Then require it in your code and call the report method, which returns a Promise:

    const szero = require('szero');
    szero.report(directory).then((jsonReport) => {
        console.log(jsonReport);
    });


## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)
