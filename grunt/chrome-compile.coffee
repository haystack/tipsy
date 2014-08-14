module.exports = ->
  @loadNpmTasks 'grunt-chrome-compile'

  @config 'chrome-extension',
    options:
      name: 'tipsy'
      version: '0.1.0'
      id: 'pjiifpoianefbagliipadlmiiifdpbhn'
      chrome: '/usr/bin/google-chrome-stable'
      clean: true
      certDir: 'certificates'
      buildDir: 'dist'
      resources: [
        'bower_components/**'
        'src/**'
        '_locales/**'
      ]
