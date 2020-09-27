import axios from 'axios'
import moment from 'moment'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let url = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('WorkPlans')/items"
let geturl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('WorkPlans')/items"
geturl += '?$select=*,Manager/Title,Manager/ID,Manager/Name,Manager/EMail&$expand=Manager'
geturl += '&$filter=(Archived eq 0)'
let murl = SPCI.webServerRelativeUrl + "/_api/Web/SiteGroups/GetByName('Workplan Managers')/users"

export default {
  getFormDigest() {
    return axios.request({
      url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  async getManagers() {
    let response = await axios.get(murl, {
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

      let response = await axios.get(purl, {
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
        // console.log('Found ' + allWorkPlans.length + ' items')
        return allWorkPlans
      }
    }
    return getAllWorkPlans(null)
  },
  async getSubs(payload) {
    let surl = url + "?$select=Subs&$filter=(Number eq '" + payload + "')"
    let response = await axios.get(surl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getManagerByWPNumber(state, payload) {
    let geturl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('WorkPlans')/items"
    geturl += '?$select=Manager/Title,Manager/ID,Manager/Name,Manager/EMail&$expand=Manager'
    geturl += "&$filter=(Number eq '" + payload + "')"
    let response = await axios.get(geturl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async getPOPByWPNumber(state, payload) {
    let geturl = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('WorkPlans')/items"
    geturl += '?$select=POPStart,POPEnd'
    geturl += "&$filter=(Number eq '" + payload + "')"
    let response = await axios.get(geturl, {
      headers: {
        accept: 'application/json;odata=verbose'
      }
    })
    let results = response.data.d.results
    return results
  },
  async saveWorkplan(payload, digest, action) {
    // payload is the full event object as json array with 1 element
    // action determines if it is new or edit
    let headers = null

    switch (action) {
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
      POPStart: moment(payload.POPStart).isValid()
        ? moment(payload.POPStart)
            .add(6, 'hours')
            .format('YYYY-MM-DD[T]HH:MM:[00Z]')
        : null,
      POPEnd: moment(payload.POPEnd).isValid()
        ? moment(payload.POPEnd)
            .add(6, 'hours')
            .format('YYYY-MM-DD[T]HH:MM:[00Z]')
        : null,
      DateApproved: moment(payload.DateApproved).isValid()
        ? moment(payload.DateApproved)
            .add(6, 'hours')
            .format('YYYY-MM-DD[T]HH:MM:[00Z]')
        : null,
      ManagerId: Number(payload.Manager)
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
      LastIndex: Number(payload.index)
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
      console.log('WorkplanService Error Updating Workplan Index: ' + error)
    }
  },
  async saveWorkplanSubs(payload, digest) {
    // payload is the full event object as json array with 1 element
    // action determines if it is new or edit
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
      Subs: payload.Subs
    }

    try {
      const response = await axios.post(url, itemprops, config)
      // go get the data for the saved item to return back to the user
      return response
    } catch (error) {
      console.log('WorkplanService Error Updating Subs: ' + error)
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
      Archived: true
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
      console.log('WorkplanService Error Updating Workplan Index: ' + error)
    }
  }
}
