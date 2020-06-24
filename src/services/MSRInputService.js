/* eslint-disable */
import axios from 'axios'

let url = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('MSRInputs')/items"
let purl = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('MSRInputsPrivate')/items"
let wpurl = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('MSRInputs')/items"
wpurl += '?$select=*,Manager/Title,Manager/ID,Manager/Name,Manager/EMail&$expand=Manager'
wpurl += "&$filter=(Archived eq 0)"
let wpmurl = _spPageContextInfo.webServerRelativeUrl + "/_api/Web/SiteGroups/GetByName('MSRInput Managers')/users"
let id = null

export default {
  getFormDigest() {
    return axios.request({
      url: _spPageContextInfo.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  async getManagers() {
    let response = await axios
      .get(wpmurl, {
          headers: {
              accept: 'application/json;odata=verbose'
          }
      })
    return response
  },
  async AddMSRInput(payload, digest) {
    // payload is the full event object as json array with 1 element
    // payload.Private will determine what list we save to
    let isPrivate = payload.Private
    let itemprops = null
    let surl = null
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'POST'
    }
        
    let config = {
      headers: headers
    }

    if (isPrivate) {
      surl = purl
      itemprops = {
        __metadata: { type: 'SP.Data.MSRInputsPrivateListItem' },
        WorkplanNumber: payload.WorkplanNumber,
        Company: payload.Company,
        Email: payload.Email,
        Section1: payload.Section1,
        Section2: payload.Section2,
        Section3: payload.Section3,
        Section4: payload.Section4,
        Section5: payload.Section5,
        Section6: payload.Section6,
        Section7: payload.Section7
      }
    } else {
      surl = url
      itemprops = {
        __metadata: { type: 'SP.Data.MSRInputsListItem' },
        WorkplanNumber: payload.WorkplanNumber,
        Company: payload.Company,
        Email: payload.Email,
        Section1: payload.Section1,
        Section2: payload.Section2,
        Section3: payload.Section3,
        Section4: payload.Section4,
        Section5: payload.Section5,
        Section6: payload.Section6,
        Section7: payload.Section7
      }
    }

    try {
      const response = await axios.post(url, itemprops, config)
      // go get the data for the saved item to return back to the user
      return axios
      .get(surl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      .then(function (response) {
        return response
      })
    }
    catch (error) {
      console.log('MSRInputService Error Updating MSRInput: ' + error)
    }
  }
}