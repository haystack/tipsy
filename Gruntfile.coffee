module.exports = ->
  @loadTasks 'build/tasks'

  @registerTask 'default', [
    'jshint'
    'chrome-extension'
  ]

  @registerTask 'coverage', [
    'env:coverage'
    'instrument'
    'test'
    'storeCoverage'
    'makeReport'
  ]

  @registerTask 'test', [
    'mochaTest:chrome-extension'
    'mochaTest:shared'
  ]

  @registerTask 'chrome-extension', [
    'clean:chrome-extension'
    'copy:chrome-extension'
    'stylus:chrome-extension'
    'es6:chrome-extension'
    'compress:chrome-extension'
    'shell:chrome-extension'
  ]
