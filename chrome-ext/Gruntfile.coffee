module.exports = ->
  @loadTasks "grunt"
  @registerTask "default", ["chrome-extension"]
