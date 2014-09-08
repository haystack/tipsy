transpiler = require 'es6-module-transpiler'

buildES6 = (options) ->
  container = new transpiler.Container(
    resolvers: [new transpiler.FileResolver([options.path])]
    formatter: new transpiler.formatters.bundle
  )
  container.getModule options.module
  container.write 'chrome-extension/dist/tipsy/' + options.chrome
  container.write 'firefox-extension/dist/tipsy/data/' + options.firefox

module.exports = ->
  @registerTask 'es6', 'Compiles ES6 modules.', ->

    buildES6
      path: 'shared/scripts/lib'
      module: 'index'
      chrome: 'js/tipsy.js'
      firefox: 'js/tipsy.js'

    buildES6
      path: 'shared/scripts'
      module: 'background'
      chrome: 'js/background.js'
      firefox: '../lib/main.js'
