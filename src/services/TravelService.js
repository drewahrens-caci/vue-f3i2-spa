import store from '../store/store'
import axios from 'axios'
import moment from 'moment'
import { isNullOrUndefined } from 'util'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let url = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Travel')/items"
let gurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Travel')/items?$select=*&$filter=(Status eq 'AFRLReview')"
let eurl = SPCI.webServerRelativeUrl + '/_api/SP.Utilities.Utility.SendEmail'
let baseurl = SPCI.webAbsoluteUrl
let geturl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Travel')/items"
geturl += '?$select=*,Author/Title,Author/ID,Author/Name,Author/EMail&$expand=Author'
// geturl += '&$filter=(Archived eq 0)'
let reporturl = SPCI.webServerRelativeUrl + "/_api/web/lists/getbytitle('TripReports')/RootFolder/Files/Add"

export default {
  async getFormDigest() {
    const response = await axios.request({
      url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
    return response
  },
  async getAllTrips() {
    let allTrips = []
    async function getAllTrips(purl) {
      if (purl === null) {
        purl = url
      }

      let response = await axios.get(purl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allTrips = allTrips.concat(results)
      // recursively load people if there is a next result
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllTrips(purl)
      } else {
        // console.log("Found " + allPersonnel.length + " people")
        return allTrips
      }
    }
    return getAllTrips(null)
  },
  getAFRLTrips() {
    return axios
      .get(gurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function(response) {
        /* if (console) {
          console.log('AFRL TRIPS: ' + response)
        } */
        let results = response.data.d.results
        return results
      })
      .catch(function(error) {
        console.log('TravelService Error Getting Results: ' + error)
      })
  },
  async uploadTripReport(payload) {
    let part = "(url='"
    part += payload.file + "',overwrite=true)"
    let url = reporturl + part
    let data = payload.buffer
    let headers = {
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': payload.digest
    }
    try {
      const response = await axios({
        url: url,
        method: 'POST',
        data: data,
        processData: false,
        async: false,
        headers: headers
      })
      return response
    } catch (error) {
      console.log('TravelService Error Adding Trip Report: ' + error)
    }
  },
  async getTripById(payload, id) {
    let turl = geturl + '&$filter=(Id eq ' + id + ')'
    return axios
      .get(turl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function(response) {
        // console.log('SINGLE TRIP: ' + response)
        let results = response.data.d.results
        return results
      })
      .catch(function(error) {
        console.log('TravelService Error Getting Results: ' + error)
      })
  },
  async getReportItem(state, uri) {
    /* if (console) {
      console.log('TravelService getReportItem URI: ' + uri)
    } */
    const response = await axios({
      method: 'GET',
      url: uri,
      headers: {
        Accept: 'application/json;odata=verbose'
      }
    })
    return response
  },
  async updateReportItem(payload, digest) {
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
      IndexNumber: payload.IndexNumber
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
  },
  sendEmail(payload, digest, id) {
    // need to somehow pass the id in the link and then have the system display info for that travel request
    let body = '<p>Hello Security Team,</p><p></p>'
    body += '<p>A new Travel Request has been submitted that requires security forms.</p><p></p>'
    body += '<p>Subject: ' + payload.Subject + '</p>'
    body += '<p>Clearance Required: ' + payload.Clearance + '</p>'
    body += '<p>Please click the link below for more details.</p><p></p>'
    body += '<p><a href="' + baseurl + '/Pages/Home.aspx#/travel/home/view?id=' + id + '">Travel Calendar</a></p>'
    let mail = {
      properties: {
        __metadata: { type: 'SP.Utilities.EmailProperties' },
        From: 'michele.dade@caci.com',
        To: { results: ['michele.dade@caci.com', 'alexie.hazen@caci.com'] }, // TODO: Get these user emails from a list/group , 'daniel.walker1@caci.com'
        // To: { 'results': ['daniel.walker1@caci.com'] },
        Body: body,
        Subject: 'New Travel Request Added To SharePoint'
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
  NewTripEmail(state, digest, payload) {
    // need to somehow pass the id in the link and then have the system display info for that travel request
    let body = '<p>A new Travel Request has been submitted on your workplan.</p><p></p>'
    body += '<p>Please click the link below for more details.</p><p></p>'
    body += '<p><a href="' + baseurl + '/Pages/Test.aspx#/travel/home/edit?id=' + payload.id + '">Edit Travel Request</a></p>'
    let mail = {
      properties: {
        __metadata: { type: 'SP.Utilities.EmailProperties' },
        From: 'daniel.walker1@caci.com',
        To: { results: [payload.email] },
        Body: body,
        Subject: 'F3I2Portal - New Travel Request Added To SharePoint'
      }
    }
    store.dispatch('support/addActivity', '<div class="bg-info">TravelService NewTripEmail TO: ' + payload.email + '</div>')
    store.dispatch('support/addActivity', '<div class="bg-info">TravelService NewTripEmail body: ' + body + '</div>')
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
        store.dispatch('support/addActivity', '<div class="bg-danger">TravelService NewTripEmail ERROR: ' + error + '</div>')
        console.log('TravelService Error Sending NewTripEmail: ' + error)
      })
  },
  EditTripEmail(state, digest, payload) {
    // send email to workplan manager regarding state of trip. Reminder of specific actions
    let body = '<p>Forward to AFRL for review of ' + payload.review + '</p><p></p>'
    body += '<p>Please click the link below for more details.</p><p></p>'
    body += '<p><a href="' + baseurl + '/Pages/Test.aspx#/travel/home/edit?id=' + payload.id + '">Edit Travel Request</a></p>'
    let mail = {
      properties: {
        __metadata: { type: 'SP.Utilities.EmailProperties' },
        From: 'daniel.walker1@caci.com',
        To: { results: [payload.email] },
        Body: body,
        Subject: 'Travel Request - Request ' + payload.review
      }
    }
    store.dispatch('support/addActivity', '<div class="bg-info">TravelService NewTripEmail TO: ' + payload.email + '</div>')
    store.dispatch('support/addActivity', '<div class="bg-info">TravelService NewTripEmail body: ' + body + '</div>')
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
        store.dispatch('support/addActivity', '<div class="bg-danger">TravelService NewTripEmail ERROR: ' + error + '</div>')
        console.log('TravelService Error Sending NewTripEmail: ' + error)
      })
  },
  async addTrip(payload, digest) {
    // payload is the full event object as json array with 1 element
    let wp = String(payload[0].WorkPlan).split(', ')
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
      __metadata: { type: 'SP.Data.TravelListItem' },
      Status: payload[0].Status,
      Title: payload[0].Subject,
      StartDate: moment(payload[0].StartTime).add(8, 'hours'), // .format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      EndDate: moment(payload[0].EndTime).add(8, 'hours'), // .format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      WorkPlan: payload[0].WorkPlan,
      WorkPlanNumber: wp[0],
      WorkPlanText: wp[1],
      EstimatedCost: Number(payload[0].EstimatedCost),
      OCONUS: payload[0].OCONUS,
      OCONUSLocation: payload[0].OCONUSLocation,
      Company: payload[0].Company,
      TravelFrom: payload[0].TravelFrom,
      TravelTo: payload[0].TravelTo,
      Travelers: JSON.stringify(payload[0].Travelers),
      Sponsor: payload[0].Sponsor,
      POCName: payload[0].POCName,
      POCEmail: payload[0].POCEmail,
      POCPhone: payload[0].POCPhone,
      Comments: payload[0].Comments,
      Clearance: payload[0].Clearance,
      InternalData: JSON.stringify(payload[0].InternalData),
      VisitRequest: payload[0].VisitRequest === 'Yes' ? 'true' : 'false'
    }
    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      console.log('TravelService Error Adding Travel: ' + error)
    }
  },
  async editTrip(payload, digest) {
    // payload is the full event object as json array with 1 element
    let url = payload[0].uri
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'If-Match': payload[0].etag
    }
    let config = {
      headers: headers
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.TravelListItem' },
      Title: payload[0].Subject,
      Status: payload[0].Status,
      StartDate: moment(payload[0].StartTime).add(8, 'hours'), // .format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      EndDate: moment(payload[0].EndTime).add(8, 'hours'), // .format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      WorkPlan: payload[0].WorkPlan,
      WorkPlanNumber: payload[0].WorkPlanNumber,
      WorkPlanText: payload[0].WorkPlanText,
      IndexNumber: payload[0].IndexNumber,
      OCONUS: payload[0].OCONUS,
      OCONUSLocation: payload[0].OCONUSLocation,
      OCONUSApprovedBy: payload[0].OCONUSApprovedBy,
      OCONUSApprovedOn: payload[0].OCONUSApprovedOn,
      OCONUSApprovedEmail: payload[0].OCONUSApprovedEmail,
      Company: payload[0].Company,
      TravelFrom: payload[0].TravelFrom,
      TravelTo: payload[0].TravelTo,
      Travelers: JSON.stringify(payload[0].Travelers),
      Sponsor: payload[0].Sponsor,
      POCName: payload[0].POCName,
      POCEmail: payload[0].POCEmail,
      POCPhone: payload[0].POCPhone,
      Comments: payload[0].Comments,
      Clearance: payload[0].Clearance,
      InternalData: JSON.stringify(payload[0].InternalData),
      VisitRequest: payload[0].VisitRequest === 'Yes' ? 'true' : 'false',
      EstimatedCost: Number(payload[0].EstimatedCost),
      SecurityAction: payload[0].SecurityAction,
      SecurityActionCompleted: payload[0].SecurityActionCompleted
    }

    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      console.log('TravelService Error Ediing Travel: ' + error)
    }
  },
  async editTripReport(payload, digest) {
    // payload is the full event object as json array with 1 element
    let url = payload[0].uri
    // let wp = String(payload[0].WorkPlan).split(', ')
    let report = {}
    report.Url = payload[0].TripReport
    report.Description = payload[0].name
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'If-Match': payload[0].etag
    }
    let config = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: 'SP.Data.TravelListItem' },
      Status: payload[0].Status,
      TripReport: !isNullOrUndefined(payload[0].TripReport) ? report : ''
    }
    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      console.log('TravelService Error Ediing Travel: ' + error)
    }
  },
  approveTravel(id, uri, etag, digest) {
    // console.log('TodoService Completing Todo with ID: ' + id + ', Digest: ' + digest + ', Uri: ' + uri + ', etag: ' + etag)
    let taskurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Travel')/items"
    if (!isNullOrUndefined(uri)) {
      taskurl = uri
    }
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'If-Match': etag
    }
    let config = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: 'SP.Data.TravelListItem' },
      Status: 'Approved'
    }
    return axios
      .post(taskurl, itemprops, config)
      .then(function(response) {
        return response
      })
      .catch(function(error) {
        console.log('TravelService Error Approving Travel: ' + error)
      })
  }
}
