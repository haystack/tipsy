module.exports = ->
  @loadNpmTasks 'grunt-contrib-watch'

  @config 'watch',
    'chrome-extension':
      files: [
        'chrome-extension/**/*'
        '!chrome-extension/dist/**/*'
        'firefox-extension/**/*'
        '!firefox-extension/dist/**/*'
        'shared/**/*'
      ]

      tasks: [
        'default'
      ]
