import axios from 'axios'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let baseUrl = SPCI.webServerRelativeUrl
let userurl = baseUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties'

export default {
  getUserProfile() {
    return axios
      .get(userurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function(response) {
        return response
      })
  },
  getTasks() {
    var allTasks = []
    function getAllTasks(taskurl) {
      if (taskurl === null) {
        taskurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Tasks')/items?"
        taskurl += '$select=*'
      }
      return axios
        .get(taskurl, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        .then(function(response) {
          // concat the data to a temporary variable
          allTasks = allTasks.concat(response.data.d.results)
          // recursively load tasks if there is a next result
          if (response.data.d.__next) {
            let turl = response.data.d.__next
            return getAllTasks(turl)
          } else {
            console.log('Found ' + allTasks.length + ' tasks')
            return allTasks
          }
        })
        .catch(function(error) {
          console.log('Supportervice Error Getting Milestones: ' + error)
        })
    }
    return getAllTasks(null)
  }
}
