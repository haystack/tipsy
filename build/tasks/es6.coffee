transpiler = require 'es6-module-transpiler'

module.exports = ->
  @registerTask 'es6-chrome', 'Compiles ES6 modules.', ->

    container = new transpiler.Container
      resolvers: [new transpiler.FileResolver(['shared/scripts'])]
      formatter: new transpiler.formatters.bundle

    container.getModule 'index'
    container.write 'chrome-extension/dist/tipsy/js/tipsy.js'

  @registerTask 'es6-firefox', 'Compiles ES6 modules.', ->

    container = new transpiler.Container
      resolvers: [new transpiler.FileResolver(['shared/scripts'])]
      formatter: new transpiler.formatters.bundle

    container.getModule 'index'
    container.write 'firefox-extension/dist/tipsy/data/js/tipsy.js'
