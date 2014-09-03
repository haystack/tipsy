module.exports = ->
  @loadNpmTasks "grunt-processhtml"

  # Convert the development sources to production in the HTML.
  @config "processhtml",
    'firefox-extension':
      files:
        "firefox-extension/dist/tipsy/data/html/index.html": [
          "shared/html/index.html"
        ]
