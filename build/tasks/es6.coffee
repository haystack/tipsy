transpiler = require 'es6-module-transpiler'

buildES6 = (options) ->
  container = new transpiler.Container(
    resolvers: [new transpiler.FileResolver([options.path])]
    formatter: new transpiler.formatters.bundle
  )

  container.getModule options.module

  if options.target is "chrome-extension"
    container.write "chrome-extension/dist/tipsy/" + options.chrome
  else if options.target is "firefox-extension"
    container.write 'firefox-extension/dist/tipsy/data/' + options.firefox

module.exports = ->
  @registerTask 'es6', 'Compiles ES6 modules.', ->

    target = @args[0]

    # Extension.
    buildES6
      target: target
      path: 'shared/scripts/lib'
      module: 'index'
      chrome: 'js/tipsy.js'
      firefox: 'js/tipsy.js'

    # Background.
    buildES6
      target: target
      path: 'shared/scripts'
      module: 'background'
      chrome: 'js/background.js'
      firefox: '../lib/main.js'

    # ContentScript.
    buildES6
      target: target
      path: 'shared/scripts'
      module: 'contentscript'
      chrome: 'js/contentscript.js'
      firefox: 'js/contentscript.js'
