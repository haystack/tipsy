module.exports = ->
  @loadNpmTasks 'grunt-contrib-stylus'

  @config 'stylus',
    'chrome-extension':
      files:
        'chrome-extension/dist/tipsy/css/tipsy.css': 'shared/styles/index.styl'

    'firefox-extension':
      files:
        'firefox-extension/dist/tipsy/data/css/tipsy.css': 'shared/styles/index.styl'
