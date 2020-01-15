/* eslint-disable */
import axios from 'axios'

export default {
  getTodos() {
    var allTodos = []
    function getAllTodos(taskurl) {
      if (taskurl === null) {
        taskurl =
          _spPageContextInfo.webServerRelativeUrl +
          "/_api/lists/getbytitle('Tasks')/items?"
        taskurl += '$select=*'
      }
      return axios
        .get(taskurl, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        .then(function (response) {
          // concat the data to a temporary variable
          allTodos = allTodos.concat(response.data.d.results)
          // recursively load tasks if there is a next result
          if (response.data.d.__next) {
            turl = response.data.d.__next
            return getAllTodos(turl)
          } else {
            console.log("Found " + allTodos.length + " todos")
            return allTodos
          }
        })
        .catch(function (error) {
          console.log('TodoService Error Getting Todos: ' + error)
        })
    }
    return getAllTodos(null)
  },
  getTodosForUser() {
      
  }
}