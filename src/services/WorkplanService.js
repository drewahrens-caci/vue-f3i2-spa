/* eslint-disable */
import axios from 'axios'
import moment from 'moment'

let url = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('WorkPlans')/items"
let geturl = _spPageContextInfo.webServerRelativeUrl + "/_api/lists/getbytitle('WorkPlans')/items"
geturl += '?$select=*,Manager/Title,Manager/ID,Manager/Name,Manager/EMail&$expand=Manager'
geturl += "&$filter=(Archived eq 0)"
let murl = _spPageContextInfo.webServerRelativeUrl + "/_api/Web/SiteGroups/GetByName('Workplan Managers')/users"
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
      .get(murl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
    return response
  },
  async getWorkPlans() {
    let allWorkPlans = []
    async function getAllWorkPlans(purl) {
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
      allWorkPlans = allWorkPlans.concat(results)
      // recursively load tasks if there is a next result
      if (response.data.d.__next) {
        purl = response.data.d.__next
        return getAllWorkPlans(purl)
      } else {
        console.log("Found " + allWorkPlans.length + " items")
        return allWorkPlans
      }
    }
    return getAllWorkPlans(null)
  },
  async saveWorkplan(payload, digest, action) {
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
      __metadata: { type: 'SP.Data.WorkPlansListItem' },
      Title: payload.Title,
      Number: payload.Number,
      Revision: payload.Revision,
      POPStart: moment(payload.POPStart).isValid() ? moment(payload.POPStart).add(6, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]') : null,
      POPEnd: moment(payload.POPEnd).isValid() ? moment(payload.POPEnd).add(6, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]') : null,
      DateApproved: moment(payload.DateApproved).isValid() ? moment(payload.DateApproved).add(6, 'hours').format('YYYY-MM-DD[T]HH:MM:[00Z]') : null,
      ManagerId: Number(payload.Manager)
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
      console.log('WorkplanService Error Updating Workplan: ' + error)
    }
  },
  async updateIndex(payload, digest) {
    // payload is the full event object as json array with 1 element
    let headers = null
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
      __metadata: { type: 'SP.Data.WorkPlansListItem' },
      LastIndex: Number(payload.index),
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
      console.log('WorkplanService Error Updating Workplan Index: ' + error)
    }
  },
  async archive(payload, digest) {
    let headers = null
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
      __metadata: { type: 'SP.Data.WorkPlansListItem' },
      Archived: true,
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
      console.log('WorkplanService Error Updating Workplan Index: ' + error)
    }
  }
}