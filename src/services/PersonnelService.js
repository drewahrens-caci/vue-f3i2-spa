/* eslint-disable */
import axios from 'axios'
import moment from 'moment'

let geturl = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('Personnel')/items?$select=*&$orderby=Title"
geturl += "&$filter=(Active eq 1)"
let url = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('Personnel')/items"
let id = null

export default {
  getFormDigest() {
    return axios.request({
      url: _spPageContextInfo.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  async getPersonnel() {
    let allPersonnel = []
    async function getAllPersonnel(purl) {
      if (purl === null) {
        purl = geturl
      }

      let response = await axios
      .get(purl, {
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
    let response = await axios
      .get(eurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
    let results = response.data.d.results
    return results
  },
  async savePersonnel(payload, digest, action) {
    // payload is the full event object as json array with 1 element
    // action determines if it is new or edit
    id = payload.Id
    let headers = null

    switch(action) {
      case 'edit':
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
          CACRequestDate: moment(payload.CACRequestDate).isValid() ? String(moment(payload.CACRequestDate).add(6, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]')) : null,
          CACExpirationDate: moment(payload.CACExpirationDate).isValid() ? String(moment(payload.CACExpirationDate).add(6, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]')) : null,
          SCIFormStatus: payload.SCIFormStatus,
          SCIFormType: payload.SCIFormType,
          SCIFormSubmitted: moment(payload.SCIFormSubmitted).isValid() ? String(moment(payload.SCIFormSubmitted).add(6, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]')) : null,
          PRDueDate: moment(payload.PRDueDate).isValid() ? String(moment(payload.PRDueDate).add(6, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]')) : null,
          CEDate: moment(payload.CEDate).isValid() ? String(moment(payload.CEDate).add(6, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]')) : null
        }
    
        try {
          const response = await axios.post(url, itemprops, config)
          // go get the data for the saved item to return back to the user
          return axios
          .get(url, {
            headers: {
              accept: 'application/json;odata=verbose'
            }
          })
          .then(function (response) {
            return response
          })
        }
        catch (error) {
          console.log('PersonnelService Error Updating Personnel: ' + error)
        }
        break

      case 'new':
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
          SubET: payload.SubET
        }
    
        try {
          const response = await axios.post(url, itemprops2, config2)
          // go get the data for the saved item to return back to the user
          return axios
          .get(url, {
            headers: {
              accept: 'application/json;odata=verbose'
            }
          })
          .then(function (response) {
            return response
          })
        }
        catch (error) {
          console.log('PersonnelService Error Updating Personnel: ' + error)
        }
        break
    }
  }
}