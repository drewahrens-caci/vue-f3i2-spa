import store from '../store/store'
import axios from 'axios'
import moment from 'moment'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let eurl = SPCI.webServerRelativeUrl + '/_api/SP.Utilities.Utility.SendEmail'
// et url = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('MSRInputs')/items"
let purl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Plans')/items"
let aurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Accomplishments')/items"
let asurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Assumptions')/items"
let riurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Risks')/items"
let opurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Opportunities')/items"
let deurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Deliverables')/items"
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
    // console.log('getMSR SERVICE payload: ' + payload)
    let url = msrurl + '(' + payload.Id + ')'
    // console.log('URL FOR REQUEST: ' + url)
    let response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    // console.log('RESPONSE FROM GET: ' + response)
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
  async getAccomplishments(payload) {
    let zurl = aurl + "?$filter=(MSRID eq '" + payload.id + "')"
    let response = await axios.get(zurl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getPlans(payload) {
    let zurl = purl + "?$filter=(MSRID eq '" + payload.id + "')"
    let response = await axios.get(zurl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getAssumptions(payload) {
    let zurl = asurl + "?$filter=(MSRID eq '" + payload.id + "')"
    let response = await axios.get(zurl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getRisks(payload) {
    let zurl = riurl + "?$filter=(MSRID eq '" + payload.id + "')"
    let response = await axios.get(zurl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getDeliverables(payload) {
    let zurl = deurl + "?$filter=(MSRID eq '" + payload.id + "')"
    let response = await axios.get(zurl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getOpportunities(payload) {
    let zurl = opurl + "?$filter=(MSRID eq '" + payload.id + "')"
    let response = await axios.get(zurl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async updateAccomplishment(payload, digest) {
    let action = payload.action
    let headers = null
    let url = aurl

    if (action == 'New') {
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'POST'
      }
    } else {
      url = payload.uri
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': payload.etag
      }
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.AccomplishmentsListItem' },
      WorkplanNumber: payload.WorkplanNumber,
      Accomplishments: payload.Accomplishments,
      Company: payload.Company,
      Email: payload.Email,
      Private: payload.Private,
      Published: payload.Published,
      Month: payload.Month,
      Year: payload.Year,
      MSRID: String(payload.MSRID)
    }

    let config = {
      headers: headers
    }

    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      // console.log('MSRInputService Error Creating MSR: ' + error)
      const notification = {
        type: 'danger',
        title: 'Error in MSRService.js updateAccomplishment function',
        message: error,
        push: true
      }
      store.dispatch('notification/add', notification, { root: true })
    }
  },
  async updatePlan(payload, digest) {
    let action = payload.action
    let headers = null
    let url = purl

    if (action == 'New') {
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'POST'
      }
    } else {
      url = payload.uri
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': payload.etag
      }
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.PlansListItem' },
      WorkplanNumber: payload.WorkplanNumber,
      Plans: payload.Plans,
      Company: payload.Company,
      Email: payload.Email,
      Private: payload.Private,
      Published: payload.Published,
      Month: payload.Month,
      Year: payload.Year,
      MSRID: String(payload.MSRID)
    }

    let config = {
      headers: headers
    }

    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      // console.log('MSRInputService Error Creating MSR: ' + error)
      const notification = {
        type: 'danger',
        title: 'Error in MSRService.js updatePlan function',
        message: error,
        push: true
      }
      store.dispatch('notification/add', notification, { root: true })
    }
  },
  async updateAssumption(payload, digest) {
    let action = payload.action
    let headers = null
    let url = asurl

    if (action == 'New') {
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'POST'
      }
    } else {
      url = payload.uri
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': payload.etag
      }
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.AssumptionsListItem' },
      WorkplanNumber: payload.WorkplanNumber,
      Assumptions: payload.Assumptions,
      Company: payload.Company,
      Email: payload.Email,
      Private: payload.Private,
      Published: payload.Published,
      Month: payload.Month,
      Year: payload.Year,
      MSRID: String(payload.MSRID)
    }

    let config = {
      headers: headers
    }

    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      // console.log('MSRInputService Error Creating MSR: ' + error)
      const notification = {
        type: 'danger',
        title: 'Error in MSRService.js updateAssumption function',
        message: error,
        push: true
      }
      store.dispatch('notification/add', notification, { root: true })
    }
  },
  async updateRisk(payload, digest) {
    let action = payload.action
    let headers = null
    let url = riurl

    if (action == 'New') {
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'POST'
      }
    } else {
      url = payload.uri
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': payload.etag
      }
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.RisksListItem' },
      WorkplanNumber: payload.WorkplanNumber,
      Risks: payload.Risks,
      Company: payload.Company,
      Email: payload.Email,
      Private: payload.Private,
      Published: payload.Published,
      Month: payload.Month,
      Year: payload.Year,
      MSRID: String(payload.MSRID)
    }

    let config = {
      headers: headers
    }

    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      // console.log('MSRInputService Error Creating MSR: ' + error)
      const notification = {
        type: 'danger',
        title: 'Error in MSRService.js updateRisk function',
        message: error,
        push: true
      }
      store.dispatch('notification/add', notification, { root: true })
    }
  },
  async updateOpportunity(payload, digest) {
    let action = payload.action
    let headers = null
    let url = opurl

    if (action == 'New') {
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'POST'
      }
    } else {
      url = payload.uri
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': payload.etag
      }
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.OpportunitiesListItem' },
      WorkplanNumber: payload.WorkplanNumber,
      Opportunites: payload.Opportunites,
      Company: payload.Company,
      Email: payload.Email,
      Private: payload.Private,
      Published: payload.Published,
      Month: payload.Month,
      Year: payload.Year,
      MSRID: String(payload.MSRID)
    }

    let config = {
      headers: headers
    }

    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      const notification = {
        type: 'danger',
        title: 'Error in MSRService.js updateOpportunity function',
        message: error,
        push: true
      }
      store.dispatch('notification/add', notification, { root: true })
    }
  },
  async updateDeliverable(payload, digest) {
    let action = payload.action
    let headers = null
    let url = deurl

    if (action == 'New') {
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'POST'
      }
    } else {
      url = payload.uri
      headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': payload.etag
      }
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.DeliverablesListItem' },
      WorkplanNumber: payload.WorkplanNumber,
      Deliverables: payload.Deliverables,
      Company: payload.Company,
      Email: payload.Email,
      Private: payload.Private,
      Published: payload.Published,
      Month: payload.Month,
      Year: payload.Year,
      MSRID: String(payload.MSRID)
    }

    let config = {
      headers: headers
    }

    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      // console.log('MSRInputService Error Creating MSR: ' + error)
      const notification = {
        type: 'danger',
        title: 'Error in MSRService.js updateDeliverable function',
        message: error,
        push: true
      }
      store.dispatch('notification/add', notification, { root: true })
    }
  },
  async createMSR(payload, digest) {
    // This function creates the MSR.
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
        // To: { 'results': ['daniel.walker1@caci.com'] },
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
  }
}
