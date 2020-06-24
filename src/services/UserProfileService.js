/* eslint-disable */
import axios from 'axios'

let id = null
let baseUrl = _spPageContextInfo.webServerRelativeUrl
let userurl = baseUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties"
let idurl = baseUrl + "/_api/Web/CurrentUser?$select=Id"
let pickerurl = baseUrl + "/_api/web/siteusers?loginName="
let pkurl = baseUrl + "/_api/web/siteusers?$select=*&$filter=(LoginName%20eq%20%27i%3A0%23.w%7Ccaci%5C"

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
  async getPickerUserId(usr) {
    console.log('PASSED IN USER: ' + usr)
    pkurl = pkurl + usr + "%27)"
    console.log('pkurl: ' + pkurl)
    const response = await axios
      .get(pkurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
    return response
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
  },
  getUserGroups(id) {
    let groupurl = baseUrl + "/_api/web/getuserbyid(" + id + ")/groups"
    return axios
      .get(groupurl, {
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