module.exports = ->
  @loadNpmTasks 'grunt-s3-sync'

  knox = require("knox")::
  headFile = knox.headFile

  # Patch knox to always return a 404, allowing overwrites.
  knox.headFile = (relative, callback) ->
    headFile.call this, relative, (err, res) ->
      res.statusCode = 404
      callback.call this, err, res

  env = process.env

  @config 's3-sync',
    options:
      key: env.AWS_KEY
      secret: env.AWS_SECRET
      bucket: 'tipsy'

    bocoup:
      files: [{
        root: "chrome-extension/dist/"
        src: 'chrome-extension/dist/tipsy.crx'
        dest: 'tipsy.crx'
      }, {
        root: "firefox-extension/dist/"
        src: 'firefox-extension/dist/tipsy.xpi'
        dest: 'tipsy.xpi'
      }]
