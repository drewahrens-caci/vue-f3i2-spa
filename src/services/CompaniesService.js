import axios from 'axios'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let url = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('Companies')/items"

export default {
  getFormDigest() {
    return axios.request({
      url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  getCompanies() {
    let allCompanies = []
    async function getAllCompanies(furl) {
      if (furl === null) {
        furl = url
      }

      let response = await axios.get(furl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allCompanies = allCompanies.concat(results)
      // recursively load items if there is a next result
      if (response.data.d.__next) {
        furl = response.data.d.__next
        return getAllCompanies(furl)
      } else {
        return allCompanies
      }
    }
    return getAllCompanies(null)
  },
  async saveCompany(payload, digest) {
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
      __metadata: { type: 'SP.Data.CompaniesListItem' },
      Title: payload.Title
    }

    try {
      const response = await axios.post(url, itemprops, config)
      // go get the data for the saved item to return back to the user
      return response
    } catch (error) {
      console.log('Companieservice Error Updating Company: ' + error)
    }
  },
  async editCompany(payload, digest) {
    // payload is the full event object as json array with 1 element
    let url = payload.uri
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
      __metadata: { type: 'SP.Data.CompaniesListItem' },
      Title: payload.Title
    }
    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      console.log('Companieservice Error Editing Company: ' + error)
    }
  }
}
