/* eslint-disable */
import axios from 'axios'
import moment from 'moment'

let url = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('FeatureRequests')/items?$orderby=Rating desc"
let ourl = _spPageContextInfo.webServerRelativeUrl + "/_api/Web/SiteGroups/GetByName('F3I-2 Owners')/users"

export default {
  getFormDigest() {
    return axios.request({
      url: _spPageContextInfo.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  async getOwners() {
    let response = await axios
      .get(ourl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
    return response
  },
  getFeatures() {
    let allFeatures = []
    async function getAllFeatures(furl) {
      if (furl === null) {
        furl = url
      }

      let response = await axios
      .get(furl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allFeatures = allFeatures.concat(results)
      // recursively load people if there is a next result
      if (response.data.d.__next) {
        furl = response.data.d.__next
        return getAllFeatures(furl)
      } else {
        return allFeatures
      }
    }
    return getAllFeatures(null)
  },
  async saveFeature(payload, digest) {
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
      __metadata: { type: 'SP.Data.FeatureRequestsListItem' },
      Title: payload.Title,
      Comment: payload.Comment,
      Category: payload.Category
    }

    try {
      const response = await axios.post(url, itemprops, config)
      // go get the data for the saved item to return back to the user
      return response
    }
    catch (error) {
      console.log('FeatureService Error Updating Feature: ' + error)
    }
  },
  async editFeature(payload, digest) {
    // payload is the full event object as json array with 1 element
    let url = payload.uri
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'If-Match': payload.etag
    }
    let config = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: 'SP.Data.FeatureRequestsListItem' },
      Title: payload.Title,
      Category: payload.Category,
      DueDate: moment(payload.DueDate).isValid() ? String(moment(payload.DueDate).add(5, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]')) : null,
      Priority: payload.Priority,
      Status: payload.Status,
      Effort: payload.Effort,
      PercentComplete: payload.PercentComplete,
      Comment: payload.Comment,
      Comments: payload.Comments
      // AssignedTo: payload.AssignedTo
    }
    try {
      const response = await axios
        .post(url, itemprops, config)
      return response
    }
    catch (error) {
      console.log('FeatureService Error Editing Feature: ' + error)
    }
  },
  async rate(payload, digest) {
    let headers = null
    let rurl = payload.uri
    headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'If-Match': payload.etag
    }
    let config = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: 'SP.Data.FeatureRequestsListItem' },
      Rating: payload.Rating,
      RatingData: payload.RatingData
    }
    try {
      const response = await axios.post(rurl, itemprops, config)
      return response
    }
    catch (error) {
      console.log('FeatureService Error Updating Rating: ' + error)
    }
  }
}