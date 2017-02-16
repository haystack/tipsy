module.exports = ->
  @loadNpmTasks 'grunt-contrib-compress'

  @config 'compress',
    'chrome-extension':
      options:
        archive: 'chrome-extension/dist/tipsy.zip'
        mode: 'zip'

      files: [
        { src: ['key.pem'], cwd: 'chrome-extension/dist' }
        { src: ['**/*'], expand: true, cwd: 'chrome-extension/dist/tipsy' }
      ]
