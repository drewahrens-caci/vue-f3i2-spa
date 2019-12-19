/* eslint-disable */
import axios from 'axios'

let location = String(window.location)
let isdev = false
let baseUrl = ''
let globalUrl = ''

if (location.indexOf('localhost') >= 0) {
  baseUrl = 'http://localhost:3000'
  isdev = true
} else {
  baseUrl = _spPageContextInfo.webServerRelativeUrl
}
  // used for dev purposes with json-server
const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: {
    Accept: 'application/json; odata=verbose'
 }
})

export default {
  getAllTrips() {
    if (isdev) {
      // when in dev mode use json-server against db.json which will be on localhost:3000
      console.log('Dev Travel')
      return apiClient.get('/travel?_sort=id&_order=asc')
    } else {

    return axios
      .get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function(response) {
        console.log(reponse)
        let results = response.data.d.results
        return results
      })
      .catch(function(error) {
        console.log('TravelService Error Getting Results: ' + error)
      })
    }
  }
}