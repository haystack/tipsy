module.exports = ->
  @loadTasks 'build/tasks'

  @registerTask 'default', [
    'jshint'
    'chrome-extension'
    'firefox-extension'
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
    'es6:chrome-extension'
    'shell:chrome-extension'
  ]

  @registerTask 'firefox-extension', [
    'clean:firefox-extension'
    'copy:firefox-extension'
    'stylus:firefox-extension'
    'targethtml:firefox'
    'es6:firefox-extension'
    'mozilla-cfx-xpi'
  ]
