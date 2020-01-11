/* eslint-disable */
import axios from 'axios'

let baseUrl = _spPageContextInfo.webServerRelativeUrl
let url = baseUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties"

export default {
  getUserProfile() {
    return axios
      .get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function (response) {
        return response
      })
  }
}