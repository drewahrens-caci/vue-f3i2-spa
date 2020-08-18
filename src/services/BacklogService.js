import axios from 'axios'
import { isNullOrUndefined } from 'util'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

export default {
  getFormDigest() {
    return axios.request({
      url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  getItems() {
    var allItems = []
    function getAllItems(taskurl) {
      if (taskurl === null) {
        taskurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Backlog')/items?"
        taskurl += '$select=*,AssignedTo/Id,AssignedTo/FirstName,AssignedTo/LastName,AssignedTo/EMail&$expand=AssignedTo'
      }
      return axios
        .get(taskurl, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        .then(function(response) {
          // concat the data to a temporary variable
          allItems = allItems.concat(response.data.d.results)
          // recursively load tasks if there is a next result
          if (response.data.d.__next) {
            let turl = response.data.d.__next
            return getAllItems(turl)
          } else {
            console.log('Found ' + allItems.length + ' items')
            return allItems
          }
        })
        .catch(function(error) {
          console.log('Backlogservice Error Getting Items: ' + error)
        })
    }
    return getAllItems(null)
  },
  getItemsByUser(id) {
    var allItems = []
    function getAllItems(taskurl, id) {
      if (taskurl === null) {
        taskurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Backlog')/items?"
        taskurl += '$select=*,AssignedTo/Id&$expand=AssignedTo/Id'
        taskurl += '&$filter=(AssignedTo/Id eq ' + id + ") and (Status ne 'Completed')"
      }
      return axios
        .get(taskurl, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        .then(function(response) {
          // concat the data to a temporary variable
          allItems = allItems.concat(response.data.d.results)
          // recursively load tasks if there is a next result
          if (response.data.d.__next) {
            let turl = response.data.d.__next
            return getAllItems(turl)
          } else {
            // console.log("Found " + allItems.length + " items")
            return allItems
          }
        })
        .catch(function(error) {
          console.log('Backlogservice Error Getting Items: ' + error)
        })
    }
    return getAllItems(null, id)
  },
  completeItem(id, uri, etag, digest) {
    let taskurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Backlog')/items"
    if (!isNullOrUndefined(uri)) {
      taskurl = uri
    }
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'If-Match': etag
    }
    let config = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: 'SP.Data.BacklogListItem' },
      Status: 'Completed'
    }
    return axios
      .post(taskurl, itemprops, config)
      .then(function(response) {
        return response
      })
      .catch(function(error) {
        console.log('BacklogService Error Updating Item: ' + error)
      })
  }
}
