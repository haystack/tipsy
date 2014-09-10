module.exports = ->
  @loadTasks 'build/tasks'

  @registerTask 'default', [
    'jshint'
    'chrome-extension'
    'firefox-extension'
    'es6'
    'shell:chrome-extension'
    'mozilla-cfx-xpi'
  ]

  @registerTask 'test', [
    'default'
    'mochaTest:firefox-extension'
    'mochaTest:chrome-extension'
  ]

  @registerTask 'chrome-extension', [
    'clean:chrome-extension'
    'compress:chrome-extension'
    'copy:chrome-extension'
    'stylus:chrome-extension'
  ]

  @registerTask 'firefox-extension', [
    'clean:firefox-extension'
    'copy:firefox-extension'
    'stylus:firefox-extension'
  ]
