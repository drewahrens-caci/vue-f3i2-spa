import axios from 'axios'
import moment from 'moment'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let url = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Bugs')/items"
let ourl = SPCI.webServerRelativeUrl + "/_api/Web/SiteGroups/GetByName('F3I-2 Owners')/users"

export default {
  getFormDigest() {
    return axios.request({
      url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  async getOwners() {
    let response = await axios.get(ourl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    return response
  },
  getBugs() {
    let allBugs = []
    async function getAllBugs(furl) {
      if (furl === null) {
        furl = url
      }

      let response = await axios.get(furl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allBugs = allBugs.concat(results)
      // recursively load people if there is a next result
      if (response.data.d.__next) {
        furl = response.data.d.__next
        return getAllBugs(furl)
      } else {
        return allBugs
      }
    }
    return getAllBugs(null)
  },
  async saveBug(payload, digest) {
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
      __metadata: { type: 'SP.Data.BugsListItem' },
      Title: payload.Title,
      BugDescription: payload.BugDescription
    }

    try {
      const response = await axios.post(url, itemprops, config)
      // go get the data for the saved item to return back to the user
      return response
    } catch (error) {
      console.log('BugService Error Updating Bug: ' + error)
    }
  },
  async editBug(payload, digest) {
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
      __metadata: { type: 'SP.Data.BugsListItem' },
      Title: payload.Title,
      DueDate: moment(payload.DueDate).isValid()
        ? String(
            moment(payload.DueDate)
              .add(5, 'hours')
              .format('YYYY-MM-DD[T]HH:MM:[00Z]')
          )
        : null,
      Priority: payload.Priority,
      Status: payload.Status,
      Effort: payload.Effort,
      PercentComplete: payload.PercentComplete,
      BugDescription: payload.BugDescription,
      AssignedTo: payload.AssignedTo
    }
    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      console.log('BugService Error Editing Bug: ' + error)
    }
  }
}
