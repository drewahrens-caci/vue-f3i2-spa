/* eslint-disable */
import axios from 'axios'

let id = null
let baseUrl = _spPageContextInfo.webServerRelativeUrl
let userurl = baseUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties"
let idurl = baseUrl + "/_api/Web/CurrentUser?$select=Id"

export default {
  getUserId() {
    return axios
      .get(idurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function (response) {
        return response
      })
  },
  getUserProfile() {
    // console.log('getUserProfile called from UserProfileService')
    return axios
      .get(userurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function (response) {
        // console.log('getUserProfile() Response: ' + response)
        return response
      })
  }
}