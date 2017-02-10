module.exports = ->
  @loadNpmTasks 'grunt-env'

  @config 'env',
    coverage:
      CODE_COV: true
