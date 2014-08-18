module.exports = ->
  @loadTasks 'grunt'

  @registerTask 'default', [
    'chrome-extension'
  ]

  @registerTask 'chrome-extension', [
    'clean:chrome-extension'
    'compress:chrome-extension'
    'copy:chrome-extension'
    'shell:chrome-extension'
  ]
