istanbulTraceur = require 'istanbul-traceur'

module.exports = ->
  @loadNpmTasks 'grunt-istanbul'

  # Inject the Istanbul Traceur version to provide proper ES6 coverage.
  task = require.cache[require.resolve('istanbul')]
  task.exports.Instrumenter = istanbulTraceur.Instrumenter

  @config 'instrument',
    options:
      basePath: 'test/coverage/instrument'
      
    files: 'shared/**/*.js'

  @config 'storeCoverage',
    options:
      dir: 'test/coverage/reports'

  @config 'makeReport',
    options:
      type: 'lcov'
      dir: 'test/coverage/reports'

    src: 'test/coverage/reports/**/*.json'
