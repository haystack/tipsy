module.exports = ->
  @loadTasks 'grunt'

  @registerTask 'default', [
    'chrome-extension'
  ]

  @registerTask 'chrome-extension', [
    'compress:chrome-extension'
    'shell:chrome-extension'
  ]
