module.exports = ->
  @loadNpmTasks 'grunt-mozilla-addon-sdk'

  @config 'mozilla-addon-sdk'
    '1_14':
      options:
        revision: '1.17'
        dest_dir: 'build/tools/'

  @config 'mozilla-cfx-xpi',
    'stable':
      options:
        'mozilla-addon-sdk': '1_14'
        extension_dir: 'firefox-extension/dist/tipsy'
        dist_dir: 'firefox-extension/dist'
        arguments: '--strip-sdk'

  @config 'mozilla-cfx',
    'run_stable':
      options:
        'mozilla-addon-sdk': '1_14',
        extension_dir: 'firefox-extension/dist/tipsy',
        command: 'run'
