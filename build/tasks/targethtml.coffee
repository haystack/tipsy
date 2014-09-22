module.exports = ->
  @loadNpmTasks 'grunt-targethtml'

  @config 'targethtml',
    'firefox':
      files:
        'firefox-extension/dist/tipsy/data/html/index.html': 'shared/html/index.html'
