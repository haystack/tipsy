module.exports = ->
  @loadTasks 'build/tasks'

  @registerTask 'default', [
    'jshint'
    'chrome-extension'
    'firefox-extension'
  ]

  @registerTask 'test', [
    'default'
    'simplemocha'
  ]

  @registerTask 'chrome-extension', [
    'clean:chrome-extension'
    'compress:chrome-extension'
    'copy:chrome-extension'
    'stylus:chrome-extension'
    'es6-chrome'
    'shell:chrome-extension'
  ]

  @registerTask 'firefox-extension', [
    'clean:firefox-extension'
    'copy:firefox-extension'
    'stylus:firefox-extension'
    'processhtml:firefox-extension'
    'es6-firefox'
    'mozilla-cfx-xpi'
  ]
