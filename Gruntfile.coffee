module.exports = ->
  @loadTasks 'build/tasks'

  @registerTask 'default', [
    'jshint'
    'chrome-extension'
  ]

  @registerTask 'test', [
    'default'
    'simplemocha:chrome-extension'
  ]

  @registerTask 'chrome-extension', [
    'clean:chrome-extension'
    'compress:chrome-extension'
    'copy:chrome-extension'
    'stylus:chrome-extension'
    'es6'
    'shell:chrome-extension'
  ]
