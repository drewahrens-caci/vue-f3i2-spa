/* eslint-disable no-case-declarations */
import store from '../store/store'
import axios from 'axios'
import moment from 'moment'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let portalemail = ''

let geturl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$orderby=Title"
geturl += '&$filter=((Active eq 1) and (OData__ModerationStatus eq 0))'
let curl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$orderby=ContactOrder"
curl += '&$filter=(Contact eq 1)'
let url = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Personnel')/items"
let surl = SPCI.webServerRelativeUrl + '/_api/SP.Utilities.Utility.SendEmail'
let baseurl = SPCI.webAbsoluteUrl
let gpbidurl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*,UserAccount/Title,UserAccount/Id&$expand=UserAccount&$filter=(UserAccount/Id eq "

export default {
  getFormDigest() {
    portalemail = store.state.support.portalemail
    return axios.request({
      url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  async getPersonnel() {
    // Might need to check if user is a Subcontractor
    let allPersonnel = []
    async function getAllPersonnel(purl) {
      if (purl === null) {
        purl = geturl
      }

      let response = await axios.get(purl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allPersonnel = allPersonnel.concat(results)
      // recursively load people if there is a next result
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllPersonnel(purl)
      } else {
        // console.log("Found " + allPersonnel.length + " people")
        return allPersonnel
      }
    }
    return getAllPersonnel(null)
  },
  async getPersonnelByEmail(email) {
    let eurl = url
    eurl += "?$filter=(Email eq '" + email + "')"
    console.log('GETPERSONNELBYEMAIL FILTER: ' + eurl)
    let response = await axios.get(eurl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getPersonnelAllValuesById(id) {
    let idurl = url
    idurl += "?$filter=(Id eq '" + id + "')"
    let response = await axios.get(idurl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getPersonnelById(id) {
    let url = gpbidurl + id + ')'
    let response = await axios.get(url, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getContacts() {
    let response = await axios.get(curl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async sendEmail(payload, digest) {
    let body = '<p>Hello Work Plan Manager</p><br/>'
    body += '<p>Personnel have been submitted that requires review.</p><p></p>'
    //body += '<p>Entry edited by ' + modifiedBy + '</p>'
    body += '<p>Please click the link below for more details.</p><p></p>'
    // Change before Test - Production
    body += '<p><a href="' + baseurl + '/Pages/drew.aspx#/personnel/home/edit/id/' + payload.Id + '">Personnel</a></p>'
    let mail = {
      properties: {
        __metadata: { type: 'SP.Utilities.EmailProperties' },
        From: portalemail,
        To: { results: ['drew.ahrens@caci.com'] }, // TODO: Get these user emails from a list/group , 'daniel.walker1@caci.com'
        // To: { 'results': ['daniel.walker1@caci.com'] },
        Body: body,
        Subject: 'Personnel Edited In SharePoint'
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
      .post(surl, mail, config)
      .then(function(response) {
        return response
      })
      .catch(function(error) {
        console.log('PersonnelService Error Sending Email: ' + error)
      })
  },
  async editSubEmail(payload, digest) {
    let body = '<p>Hello Work Plan Manager</p><br/>'
    body += '<p>Personnel have been submitted that requires review.</p><p></p>'
    // TODO: Add what was changed between the two submissions
    body += '<p>Here is what changed: </p>'
    let emailObject = JSON.parse(payload.Modification)
    for (const p in emailObject) {
      if (p !== 'etag' && p !== 'uri' && p !== '$id' && p !== 'id' && p !== 'Id' && emailObject[p] !== null) {
        body += '<p>' + p + ': ' + emailObject[p] + '</p>'
      }
    }
    //body += '<p>Entry edited by ' + modifiedBy + '</p>'
    body += '<p>Please click the link below for more details.</p><p></p>'
    // Change before Test - Production
    body += '<p><a href="' + baseurl + '/Pages/drew.aspx#/personnel/home/edit/' + payload.Id + '">Personnel</a></p>'
    //let emails = ['drew.ahrens@caci.com', 'alexie.hazen@caci.com']
    let emails = []
    if (payload.WPManagerEmails.length > 0) {
      payload.WPManagerEmails.foreach(email => {
        emails.push(email)
      })
    }
    let mail = {
      properties: {
        __metadata: { type: 'SP.Utilities.EmailProperties' },
        From: portalemail,
        To: { results: emails }, // TODO: Get these user emails from a list/group , 'daniel.walker1@caci.com'
        // To: { 'results': ['daniel.walker1@caci.com'] },
        Body: body,
        Subject: 'Personnel Edited In SharePoint'
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
      .post(surl, mail, config)
      .then(function(response) {
        return response
      })
      .catch(function(error) {
        console.log('PersonnelService Error Sending Email: ' + error)
      })
  },
  async newSubEmail(payload, digest) {
    let emailData = JSON.parse(payload.Modification)
    let body = '<p>Hello Work Plan Manager</p><br/>'
    body += '<p>Personnel have been submitted that requires review.</p><p></p>'
    body += '<p>New User Submitted: </p>'
    body += '<p>Personnel: ' + emailData.FirstName + ' ' + emailData.LastName + '</p>'
    body += '<p>Company: ' + emailData.Company + '</p>'
    body += '<p>Email: ' + emailData.Email + '</p>'
    body += '<p>Phone: ' + emailData.Phone + '</p>'
    body += '<p>Please click the link below for more details.</p><p></p>'
    // Change before Test - Production
    body += '<p><a href="' + baseurl + '/Pages/drew.aspx#/personnel/home/edit/' + payload.Id + '">Personnel</a></p>'
    // let emails = ['drew.ahrens@caci.com', 'alexie.hazen@caci.com']
    let emails = []
    if (payload.WPManagerEmails.length > 0) {
      payload.WPManagerEmails.foreach(email => {
        emails.push(email)
      })
    }
    let mail = {
      properties: {
        __metadata: { type: 'SP.Utilities.EmailProperties' },
        From: portalemail,
        To: { results: emails }, // TODO: Get these user emails from a list/group , 'daniel.walker1@caci.com'
        // To: { 'results': ['daniel.walker1@caci.com'] },
        Body: body,
        Subject: 'Personnel Added In SharePoint'
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
      .post(surl, mail, config)
      .then(function(response) {
        return response
      })
      .catch(function(error) {
        console.log('PersonnelService Error Sending Email: ' + error)
      })
  },
  async savePersonnel(payload, digest, action) {
    // payload is the full event object as json array with 1 element
    // action determines if it is new or edit
    let headers = null
    switch (action) {
      case 'edit': {
        url = payload.uri
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
          __metadata: { type: 'SP.Data.PersonnelListItem' },
          WPData: JSON.stringify(payload.WPData),
          Title: payload.LastName,
          FirstName: payload.FirstName,
          Middle: payload.Middle,
          Cadency: payload.Cadency,
          Position: payload.Position,
          Location: payload.Location,
          Email: payload.Email,
          Phone: payload.Phone,
          Company: payload.Company,
          SubET: payload.SubET,
          CACStatus: payload.CACStatus,
          CACRequestDate: moment(payload.CACRequestDate).isValid()
            ? String(
                moment(payload.CACRequestDate)
                  .add(6, 'hours')
                  .format('YYYY-MM-DD[T]HH:MM:[00Z]')
              )
            : null,
          CACExpirationDate: moment(payload.CACExpirationDate).isValid()
            ? String(
                moment(payload.CACExpirationDate)
                  .add(6, 'hours')
                  .format('YYYY-MM-DD[T]HH:MM:[00Z]')
              )
            : null,
          SCIFormStatus: payload.SCIFormStatus,
          SCIFormType: payload.SCIFormType,
          SCIFormSubmitted: moment(payload.SCIFormSubmitted).isValid()
            ? String(
                moment(payload.SCIFormSubmitted)
                  .add(6, 'hours')
                  .format('YYYY-MM-DD[T]HH:MM:[00Z]')
              )
            : null,
          PRDueDate: moment(payload.PRDueDate).isValid()
            ? String(
                moment(payload.PRDueDate)
                  .add(6, 'hours')
                  .format('YYYY-MM-DD[T]HH:MM:[00Z]')
              )
            : null,
          CEDate: moment(payload.CEDate).isValid()
            ? String(
                moment(payload.CEDate)
                  .add(6, 'hours')
                  .format('YYYY-MM-DD[T]HH:MM:[00Z]')
              )
            : null,
          Modification: payload.Modification,
          ModDeniedReason: payload.ModDeniedReason
        }

        try {
          await axios.post(url, itemprops, config)
          // go get the data for the saved item to return back to the user
          return axios
            .get(url, {
              headers: {
                accept: 'application/json;odata=verbose'
              }
            })
            .then(function(response) {
              return response
            })
        } catch (error) {
          console.log('PersonnelService Error Updating Personnel: ' + error)
        }
        break
      }

      case 'new': {
        headers = {
          'Content-Type': 'application/json;odata=verbose',
          Accept: 'application/json;odata=verbose',
          'X-RequestDigest': digest,
          'X-HTTP-Method': 'POST'
        }
        let config2 = {
          headers: headers
        }

        let itemprops2 = {
          __metadata: { type: 'SP.Data.PersonnelListItem' },
          WPData: JSON.stringify(payload.WPData),
          Title: payload.LastName,
          FirstName: payload.FirstName,
          Middle: payload.Middle,
          Location: payload.Location,
          Email: payload.Email,
          Phone: payload.Phone,
          Company: payload.Company,
          SubET: payload.SubET,
          Modification: payload.Modification,
          ModDeniedReason: payload.ModDeniedReason
        }

        try {
          await axios.post(url, itemprops2, config2)
          // go get the data for the saved item to return back to the user
          return axios
            .get(url, {
              headers: {
                accept: 'application/json;odata=verbose'
              }
            })
            .then(function(response) {
              return response
            })
        } catch (error) {
          console.log('PersonnelService Error Updating Personnel: ' + error)
        }
        break
      }

      case 'newSub': {
        headers = {
          'Content-Type': 'application/json;odata=verbose',
          Accept: 'application/json;odata=verbose',
          'X-RequestDigest': digest,
          'X-HTTP-Method': 'POST'
        }
        let config2 = {
          headers: headers
        }

        let itemprops2 = {
          __metadata: { type: 'SP.Data.PersonnelListItem' },
          WPData: JSON.stringify(payload.WPData),
          Title: payload.LastName,
          FirstName: payload.FirstName,
          Middle: payload.Middle,
          Location: payload.Location,
          Email: payload.Email,
          Phone: payload.Phone,
          Company: payload.Company,
          SubET: payload.SubET,
          Modification: payload.Modification,
          ModDeniedReason: payload.ModDeniedReason
        }

        try {
          let response = await axios.post(url, itemprops2, config2)
          return response.data.d
        } catch (error) {
          console.log('PersonnelService Error Updating Personnel: ' + error)
        }
        break
      }
    }
  }
}
