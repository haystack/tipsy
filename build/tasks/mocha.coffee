module.exports = ->
  @loadNpmTasks 'grunt-simple-mocha'

  @config 'simplemocha',
    'chrome-extension':
      src: ['chrome-extension/test/integration.js']

    'shared':
      src: ['shared/test/runner.js', 'shared/test/tests/**/*.js']
