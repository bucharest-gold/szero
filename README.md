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
| Engines:        | Node.js 4.x, 6.x, 8.x |

## Installation

```
npm install szero -g
```

## Usage

```
szero /path_to/project  (or use '.' for current directory)
szero .
szero . --ignore (ignore the specified directories. e.g: bower_components,examples)
szero . --file (enable file reporter)
szero . --license (enable license lookup)
szero . --filename <filename> (change the default filename)
szero . --ci (enables process.exit() when unused dependency found)
szero . --dev (enables devDependencies processing)
szero . --summary (enables summary report)
szero . --silent (hides the console output)
szero . --silent (omits the output of information in the console) 
```

![out.gif](https://raw.githubusercontent.com/bucharest-gold/szero/master/out.gif)

![a.png](https://raw.githubusercontent.com/bucharest-gold/szero/master/a.png)

The default output is to the console, but you can specify a "reporter" of file to also output the results to a file called szero.txt

```
szero /path_to/myproject --file
```

To change the filename that is outputted, use the `--filename` option.

```
szero /path_to/myproject --filename output.txt
```

### Programmatic API

To use the `szero` api in code, first install it locally

```
npm install szero --save
```

Then require it in your code and call the report method, which returns a Promise:

```js
const szero = require('szero');
szero.report(directory).then((jsonReport) => {
    console.log(jsonReport);
});
```

To have the ouput be in the "file" format, for outputting to a file, just use the fileReport method, which also returns a Promise:

```js
const szero = require('szero');
szero.fileReport(directory).then((fileReport) => {
    fs.writeFileSync('szero.txt', fileReport);
});
```

More information can be found on the docs: https://bucharest-gold.github.io/szero/module-szero.html

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)
