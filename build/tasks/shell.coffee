module.exports = ->
  @loadNpmTasks 'grunt-shell'

  # Find Chrome binary here...

  @config 'shell',
    'chrome-extension':
      command: 'google-chrome ' + [
        '--pack-extension=chrome-extension/dist/tipsy'
        '--pack-extension-key=chrome-extension/key.pem'
        '--no-message-box'
      ].join(' ')
