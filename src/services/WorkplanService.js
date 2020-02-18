/* eslint-disable */
import axios from 'axios'
import moment from 'moment'
import { isNullOrUndefined } from 'util'

let url = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('WorkPlans')/items"
let eurl = _spPageContextInfo.webServerRelativeUrl + "/_api/SP.Utilities.Utility.SendEmail"
let baseurl = _spPageContextInfo.webServerRelativeUrl

export default {
  getFormDigest() {
    return axios.request({
      url: _spPageContextInfo.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  async getWorkPlans() {
    let allWorkPlans = []
    async function getAllWorkPlans(purl) {
      if (purl === null) {
        purl = url
      }

      let response = await axios
      .get(purl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allWorkPlans = allWorkPlans.concat(results)
      // recursively load tasks if there is a next result
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllWorkPlans(purl)
      } else {
        console.log("Found " + allWorkPlans.length + " items")
        return allWorkPlans
      }
    }
    return getAllWorkPlans(null)
  },
  async addWorkplan(payload, digest) {
    // payload is the full event object as json array with 1 element

    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'POST'
    }

    let config = {
      headers: headers
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.WorkPlansListItem' },
      Title: payload[0].Title,
      Number: payload[0].Number,
      Revision: payload[0].Revision,
      Manager: payload[0].Manager
    }

    try {
      const response = await axios
        .post(url, itemprops, config)
      return response
    }
    catch (error) {
      console.log('Workplan Service Error Adding WorkPlan: ' + error)
    }
  }
}