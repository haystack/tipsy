module.exports = ->
  @loadNpmTasks 'grunt-contrib-copy'

  chromeDest = 'chrome-extension/dist/tipsy'

  npmDeps = [
    'node_modules/jquery/dist/*',
    'node_modules/purecss/build/*',
    'node_modules/combyne/dist/*'
    'node_modules/moment/min/*'
    'node_modules/tablesort/*'
  ]

  @config 'copy',
    'chrome-extension':
      files: [
        {
          src: npmDeps
          expand: true
          dest: chromeDest
        }
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
