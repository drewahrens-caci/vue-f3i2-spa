/* eslint-disable */
import axios from 'axios'

let url = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('Travel')/items"


export default {
  getAllTrips() {
    return axios
      .get(url, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function(response) {
        console.log(response)
        let results = response.data.d.results
        return results
      })
      .catch(function(error) {
        console.log('TravelService Error Getting Results: ' + error)
      })
  }
}