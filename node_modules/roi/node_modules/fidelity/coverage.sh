#!/bin/bash

BIN=./node_modules/.bin

$BIN/istanbul cover --report none --include-pid $BIN/promises-aplus-tests test/spec-adapter.js
$BIN/istanbul cover --report none --include-pid test/tape-test.js
$BIN/istanbul report lcov
$BIN/istanbul report text-summary