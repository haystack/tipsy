module.exports = ->
  @loadNpmTasks 'grunt-contrib-watch'

  @config 'watch',
    'chrome-extension':
      files: [
        'chrome-extension/**/*'
        'shared/**/*'
        '!chrome-extension/dist/**/*'
      ]

      tasks: [
        'jshint'
        'clean:chrome-extension'
        'copy:chrome-extension'
        'es6'
        'stylus:chrome-extension'
      ]
