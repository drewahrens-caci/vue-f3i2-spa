import store from '../store/store'
import axios from 'axios'
import moment from 'moment'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let eurl = SPCI.webServerRelativeUrl + '/_api/SP.Utilities.Utility.SendEmail'
let msrurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('MSRs')/items"

let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
let m = moment().get('month')
let month = months[m]
let year = moment().year()

export default {
  getFormDigest() {
    return axios.request({
      url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  async getMSR(payload) {
    let url = msrurl + '(' + payload.Id + ')'
    let response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d
    return results
  },
  async getMSRs() {
    let allMSRs = []
    async function getallMSRs(surl) {
      if (surl === null) {
        surl = msrurl // + "?$filter=(Created ge datetime'" + searchdate + "')"
      }

      let response = await axios.get(surl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allMSRs = allMSRs.concat(results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        surl = response.data.d.__next
        return getallMSRs(surl)
      } else {
        console.log('Found ' + allMSRs.length + ' items')
        return allMSRs
      }
    }
    return getallMSRs(null)
  },
  async publishMSR(payload, digest) {
    let furl = payload.uri
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
      __metadata: { type: 'SP.Data.MSRsListItem' }
    }
    itemprops.Status = 'Published'
    try {
      await axios.post(furl, itemprops, config)
      // go get the data for the saved item to return back to the user and use it to update the current MSR
      return axios
        .get(furl, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        .then(function(response) {
          return response.data.d
        })
    } catch (error) {
      console.log('MSRService Error Updating MSR: ' + error)
    }
  },
  async createMSR(payload, digest) {
    // This function creates the MSR.
    // TODO: Update when ready to create all MSRS
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
      __metadata: { type: 'SP.Data.MSRsListItem' },
      WorkplanNumber: payload.Number,
      WorkplanTitle: payload.Title,
      Month: month,
      Year: String(year),
      Status: 'Draft'
    }

    try {
      const response = await axios.post(msrurl, itemprops, config)
      return response
    } catch (error) {
      console.log('MSRInputService Error Creating MSR: ' + error)
    }
  },
  async updateMSRData(payload, digest) {
    let furl = payload.uri
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
      __metadata: { type: 'SP.Data.MSRsListItem' }
    }
    itemprops[payload.field] = payload.value
    try {
      await axios.post(furl, itemprops, config)
      // go get the data for the saved item to return back to the user and use it to update the current MSR
      return axios
        .get(furl, {
          headers: {
            accept: 'application/json;odata=verbose'
          }
        })
        .then(function(response) {
          return response.data.d
        })
    } catch (error) {
      console.log('MSRService Error Updating MSR: ' + error)
    }
  },
  async sendDistributionRequest(payload, digest) {
    // need to somehow pass the id in the link and then have the system display info for that travel request
    let body = '<p>I am requesting the following user be added to the distribution of the MSR for Workplan ' + payload.WorkplanNumber + '</p><p></p>'
    body += '<p>Title: ' + payload.Title + '</p>'
    body += '<p>Name: ' + payload.Name + '</p>'
    body += '<p>Organization: ' + payload.Organization + '</p>'
    body += '<p>Phone: ' + payload.Phone + '</p>'
    body += '<p>Location: ' + payload.Location + '</p>'
    body += '<p>Email: ' + payload.Email + '</p><p></p><p></p>'
    let mail = {
      properties: {
        __metadata: { type: 'SP.Utilities.EmailProperties' },
        From: payload.From,
        To: { results: [payload.To] },
        Body: body,
        Subject: 'New Distribution Request For MSR'
      }
    }
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'POST'
    }
    let config = {
      headers: headers
    }
    return axios
      .post(eurl, mail, config)
      .then(function(response) {
        return response
      })
      .catch(function(error) {
        console.log('TravelService Error Sending Email: ' + error)
      })
  },
  async getMSRDocument(state, uri) {
    const response = await axios({
      method: 'GET',
      url: uri,
      headers: {
        Accept: 'application/json;odata=verbose'
      }
    })
    return response
  },
  async updateMSRDocument(payload, digest) {
    let endpoint = payload.uri
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
      __metadata: { type: payload.type },
      FileLeafRef: payload.name,
      Title: payload.name,
      WorkplanNumber: payload.WorkplanNumber,
      WorkplanTitle: payload.WorkplanTitle,
      Month: payload.Month,
      Year: payload.Year
    }
    return axios
      .post(endpoint, itemprops, config)
      .then(function(response) {
        return response
      })
      .catch(function(error) {
        const notification = {
          type: 'danger',
          title: 'Travel Service Error: ' + error,
          message: 'Error Updating Trip Report Data',
          push: true
        }
        store.dispatch('notification/add', notification, { root: true })
      })
  }
}
