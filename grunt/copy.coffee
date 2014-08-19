module.exports = ->
  @loadNpmTasks 'grunt-contrib-copy'

  dest = 'chrome-extension/dist/tipsy'

  @config 'copy',
    'chrome-extension':
      files: [
        { src: ['bower_components/**/*'], expand: true, dest: dest }
        {
          src: [
            '**/*'
            '!_assets/**'
          ]
          expand: true
          cwd: 'shared'
          dest: dest
        }
        {
          src: [
            'manifest.json'
            '_locales/**'
          ]
          expand: true
          cwd: 'chrome-extension'
          dest: dest
        }
      ]
