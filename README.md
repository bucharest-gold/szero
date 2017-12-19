# szero

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/szero/badge.svg)](https://coveralls.io/github/bucharest-gold/szero)
[![Build Status](https://travis-ci.org/bucharest-gold/szero.svg?branch=master)](https://travis-ci.org/bucharest-gold/szero)
[![Known Vulnerabilities](https://snyk.io/test/npm/szero/badge.svg)](https://snyk.io/test/npm/szero)
[![dependencies Status](https://david-dm.org/bucharest-gold/szero/status.svg)](https://david-dm.org/bucharest-gold/szero)

[![NPM](https://nodei.co/npm/szero.png)](https://npmjs.org/package/szero)

Sub Zero dependency search.

## Installation

```
npm install szero -g
```

## Usage

```
$ szero --help
Usage: szero /path/to/project [options]

Options:
  --version     Show version number                                    [boolean]
  --ignore, -i  ignores the specified directories separated by space. e.g:
                bower_components examples test             [array] [default: []]
  --ci          enables process.exit() when unused dependency found.
                                                                [default: false]
  --dev         enables devDependencies processing.             [default: false]
  --help        Show help                                              [boolean]
```

```
------------------------------------------------------------
[ Unused dependencies ]
------------------------------------------------------------
commander
------------------------------------------------------------
[ Unused devDependencies ]
------------------------------------------------------------
eslint
eslint-config-semistandard
eslint-config-standard
eslint-plugin-import
eslint-plugin-node
eslint-plugin-promise
eslint-plugin-react
eslint-plugin-standard
license-reporter
nsp
nyc
standard-version
tap-spec
```

> NOTE: Not always devDependences are used via require(), so a larger number of unused devDependencies is expected in the output result.

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)
