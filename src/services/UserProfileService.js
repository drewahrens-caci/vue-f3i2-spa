import axios from 'axios'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let baseUrl = SPCI.webServerRelativeUrl
let userurl = baseUrl + '/_api/SP.UserProfiles.PeopleManager/GetMyProperties'
let idurl = baseUrl + '/_api/Web/CurrentUser?$select=Id'

export default {
  getUserId() {
    return axios
      .get(idurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function(response) {
        return response
      })
  },
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
  getUserGroups(id) {
    let groupurl = baseUrl + '/_api/web/getuserbyid(' + id + ')/groups'
    return axios
      .get(groupurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function(response) {
        return response
      })
  }
}
