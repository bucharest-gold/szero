'use strict';

const taskName = 'szero';
const szero = require('../bin/cli.js');

module.exports = function(grunt) {

  grunt.registerTask(taskName, 'Sub Zero dependency search', function() {
    const taskConfig = grunt.config.get('szero') || {};
    var options = grunt.config.merge({
      'szero': {
        ci: grunt.option('ci') || taskConfig.ci || false,
        directory: grunt.option('directory') || taskConfig.directory || '.',
        dev: grunt.option('dev') || taskConfig.dev || false,
        fileReporter: grunt.option('file') || taskConfig.file || false,
        filename: grunt.option('filename') || taskConfig.filename || 'szero.txt',
        summary: grunt.option('summary') || taskConfig.summary || false
      }
    }).szero;
    options.consoleReporter = !options.fileReporter;
    logOptions(options, grunt);
    szero(options.directory, options);
  });

};

function logOptions(options, grunt) {
    grunt.log.debug('ci: ' + options.ci);
    grunt.log.debug('directory: ' + options.directory);
    grunt.log.debug('dev: ' + options.dev);
    grunt.log.debug('consoleReporter: ' + options.consoleReporter);
    grunt.log.debug('fileReporter: ' + options.fileReporter);
    grunt.log.debug('filename: ' + options.filename);
    grunt.log.debug('summary: ' + options.summary);
}
