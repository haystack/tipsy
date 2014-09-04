module.exports = ->
  @loadNpmTasks 'grunt-contrib-copy'

  chromeDest = 'chrome-extension/dist/tipsy'
  firefoxDest = 'firefox-extension/dist/tipsy'

  @config 'copy',
    'chrome-extension':
      files: [
        { src: ['node_modules/purecss/*'], expand: true, dest: chromeDest }
        {
          src: [
            '**/*'
            '!_assets/**'
          ]
          expand: true
          cwd: 'shared'
          dest: chromeDest
        }
        {
          src: [
            'manifest.json'
            '_locales/**'
          ]
          expand: true
          cwd: 'chrome-extension'
          dest: chromeDest
        }
      ]

    'firefox-extension':
      files: [
        { src: ['node_modules/purecss/*'], expand: true, dest: firefoxDest }
        {
          src: [
            '**/*'
            '!_assets/**'
          ]
          expand: true
          cwd: 'shared'
          dest: firefoxDest + '/data'
        }
        {
          src: [
            'data/**'
            'lib/**'
            'package.json'
          ]
          expand: true
          cwd: 'firefox-extension'
          dest: firefoxDest
        }
      ]
