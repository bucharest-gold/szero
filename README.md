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
| Documentation:  | https://bucharest-gold.github.io/szero/module-szero.html |
| Issue tracker:  | https://github.com/bucharest-gold/szero/issues |
| Engines:        | Node.js 4.x, 5.x, 6.x |

## Installation

    npm install szero -g

## Usage

    $ szero /path_to/project  (or use '.' for current directory)
    $ szero .
    $ szero . --ci  ('break the build' if unused dependencies found)
    $ szero . --file (report the result to a file)
    $ szero . --filename (specify a different filename, defaults to szero.txt)
    $ szero . --dev (enables devDependencies search).
    $ szero . --file --dev
    $ szero . --summary  (shows only unused and missing dependencies)
    $ szero --help (shows help and usage)
    $ szero --version (shows szero's version)

![out.gif](https://raw.githubusercontent.com/bucharest-gold/szero/master/out.gif)

![a.png](https://raw.githubusercontent.com/bucharest-gold/szero/master/a.png)

The default output is to the console, but you can specify a "reporter" of file to also output the results to a file called szero.txt

    $szero /path_to/myproject --file

To change the filename that is outputted, use the `--filename` option.

    $szero /path_to/myproject --filename output.txt

## Grunt plugin
Sub Zero provides a Grunt plugin.

### Load the plugin
This is done by adding the following line in `Gruntfile.js`

     grunt.loadNpmTasks('szero');

### Configure the plugin
This is done by adding the `grunt.initConfig` section in `Gruntfile.js`

    szero: {
      directory: '.',
      ci: false,
      file: false,
      filename: 'szero.txt',
      dev: false,
      summary: false
    } 

The above values are the default value and you are only required to list the you want to override. If you
are happy with the default you don't need a configuration at all.

### Usage
With the configuration above running is simply a matter of:

    $ grunt szero

The configuration options can be overriden on the grunt command line, for example:

    $ grunt szero --file --filename=somefile.txt

### Programmatic API

To use the `szero` api in code, first install it locally

    $ npm install szero --save

Then require it in your code and call the report method, which returns a Promise:

    const szero = require('szero');
    szero.report(directory).then((jsonReport) => {
        console.log(jsonReport);
    });

To have the ouput be in the "file" format, for outputting to a file, just use the fileReport method, which also returns a Promise:

    const szero = require('szero');
    szero.fileReport(directory).then((fileReport) => {
        fs.writeFileSync('szero.txt', fileReport);
    });

More information can be found on the docs: https://bucharest-gold.github.io/szero/module-szero.html

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)
