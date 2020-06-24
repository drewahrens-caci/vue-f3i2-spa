/* eslint-disable */
import Company from '@/models/Company'
import CompaniesService from '@/services/CompaniesService.js'

const getters = {
  allCompanies() {
    return Company.all()
  },
  Loaded: state => {
    return state.loaded
  }
}

const actions = {
  getDigest() {
    CompaniesService.getFormDigest()
      .then(response => {
        Company.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  async getCompanies({ state, commit }) {
    let response = await CompaniesService.getCompanies()
    Company.create({ data: formatCompany(response) })
    Company.commit(state => {
      state.loaded = true
    })
  },
  async addCompany({ state }, payload) {
    let response = await CompaniesService.saveCompany(payload, state.digest)
    return response
  },
  async editCompany({ state }, payload) {
    console.log('PAYLOAD: ' + payload)
    let response = await CompaniesService.editCompany(payload, state.digest)
    return response
  }
}

function formatCompany(j) {
  // console.log('FORMATTING WORKPLANS: ' + j)
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Title: j[i]['Title'], // This is the Title column in SharePoint
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return p
}

export default {
  getters,
  actions
}
