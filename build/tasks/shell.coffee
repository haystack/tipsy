module.exports = ->
  @loadNpmTasks 'grunt-shell'

  # https://code.google.com/p/selenium/wiki/ChromeDriver#Requirements
  if process.platform is 'linux'
    chrome = '/usr/bin/google-chrome'
  else if process.platform is 'darwin'
    chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

  @config 'shell',
    'chrome-extension':
      command: [
        chrome
        '--pack-extension=chrome-extension/dist/tipsy'
        '--pack-extension-key=chrome-extension/key.pem'
        '--no-message-box'
      ].join(' ')
