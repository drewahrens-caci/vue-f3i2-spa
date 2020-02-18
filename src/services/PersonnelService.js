/* eslint-disable */
import axios from 'axios'
import moment from 'moment'
import { isNullOrUndefined } from 'util'

let url = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('Personnel')/items"
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
  async getPersonnel() {
    let allPersonnel = []
    async function getAllPersonnel(purl) {
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
      allPersonnel = allPersonnel.concat(results)
      // recursively load tasks if there is a next result
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllPersonnel(purl)
      } else {
        console.log("Found " + allPersonnel.length + " items")
        return allPersonnel
      }
    }
    return getAllPersonnel(null)
  },
  async savePersonnel(payload, digest, action) {
    // payload is the full event object as json array with 1 element
    // action determines if it is new or edit
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
        break

      case 'new':
        headers = {
          'Content-Type': 'application/json;odata=verbose',
          Accept: 'application/json;odata=verbose',
          'X-RequestDigest': digest,
          'X-HTTP-Method': 'POST'
        }
        break
    }

    let config = {
      headers: headers
    }

    let itemprops = {
      __metadata: { type: 'SP.Data.PersonnelListItem' },
      Active: payload.Active === 'yes' ? 'true' : 'false',
      Title: payload.LastName,
      FirstName: payload.FirstName,
      Middle: payload.Middle,
      Cadency: payload.Cadency,
      Position: payload.Position,
      WorkPlan: payload.WorkPlan,
      Contact: payload.Contact === 'yes' ? 'true' : 'false',
      Location: payload.Location,
      Email: payload.Email,
      Company: payload.Company,
      CACRequestDate: moment(payload.CACRequestDate).isValid() ? moment(payload.CACRequestDate).format('YYYY-MM-DD[T]HH:MM:[00Z]') : null,
      CACRequestSubmitted: isNullOrUndefined(payload.CACRequestDate) ? 'false' : 'true',
      CACExpirationDate: moment(payload.CACExpirationDate).isValid() ? moment(payload.CACExpirationDate).format('YYYY-MM-DD[T]HH:MM:[00Z]') : null,
      EffectiveDate: moment(payload.EffectiveDate).isValid() ? moment(payload.EffectiveDate).format('YYYY-MM-DD[T]HH:MM:[00Z]') : null,
      NominationForm: payload.NominationForm,
      TransferForm: payload.TransferForm,
      FormsSubmitted: moment(payload.FormsSubmitted).isValid() ? moment(payload.FormsSubmitted).format('YYYY-MM-DD[T]HH:MM:[00Z]') : null,
      RequiredAccounts: payload.RequiredAccounts,
      Notes: payload.Notes,
      SubmittedToAFRL: moment(payload.SubmittedToAFRL).isValid() ? moment(payload.SubmittedToAFRL).format('YYYY-MM-DD[T]HH:MM:[00Z]') : null
    }

    try {
      const response = await axios
        .post(url, itemprops, config)
      return response
    }
    catch (error) {
      console.log('PersonnelService Error Updating Personnel: ' + error)
    }
  }
}