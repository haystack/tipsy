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
        'jshint'
        'clean:chrome-extension'
        'copy:chrome-extension'
        'es6'
        'stylus:chrome-extension'
        'firefox-extension'
      ]
