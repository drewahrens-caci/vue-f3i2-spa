/* eslint-disable */
import axios from 'axios'
import moment from 'moment'

let url = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('Travel')/items"
let eurl = _spPageContextInfo.webServerRelativeUrl + "/_api/SP.Utilities.Utility.SendEmail"

export default {
  getFormDigest() {
    return axios.request({
      url: _spPageContextInfo.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
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
  },
  sendEmail(payload, digest, id) {
    // need to somehow pass the id in the link and then have the system display info for that travel request
    let body = '<p>Hello Security Team,</p><p></p>'
    body += '<p>A new Travel Request has been submitted that requires security forms.</p><p></p>'
    body += '<p>Subject: ' + payload.Subject + '</p>'
    body += '<p>Clearance Required: ' + payload.Clearance + '</p>'
    body += '<p>Please click the link below for more details.</p><p></p>'
    body += '<p><a href="https://infoplus.caci.com/sites/f3i2/Pages/Home.aspx#/travel/home/default">Travel Calendar</a></p>'

    let mail = {
      properties: {
        __metadata: { type: 'SP.Utilities.EmailProperties' },
        From: 'daniel.walker1@caci.com',
        // To: { 'results': ['michele.dade@caci.com', 'alexie.hazen@caci.com', 'daniel.walker1@caci.com'] },
        To: { 'results': ['daniel.walker1@caci.com'] },
        Body: body,
        Subject: 'TEST - New Travel Request Added To SharePoint'
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
  async addTrip(payload, digest) {
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
      __metadata: { type: 'SP.Data.TravelListItem' },
      Status: 'New',
      Title: payload[0].Subject,
      StartDate: moment(payload[0].StartTime).add(8, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      EndDate: moment(payload[0].EndTime).add(8, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      WorkPlan: payload[0].WorkPlan,
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
      VisitRequest: payload[0].VisitRequest === 'yes' ? 'true' : 'false',
      EstimatedCost: Number(payload[0].EstimatedCost),
      IndexNumber: payload[0].IndexNumber
    }

    /* return axios.request({
      url: url,
      method: 'post',
      headers: headers,
      data: JSON.stringify(itemprops)
    }) */

    try {
      const response = await axios
        .post(url, itemprops, config)
      return response
    }
    catch (error) {
      console.log('TravelService Error Adding Travel: ' + error)
    }
  }
}