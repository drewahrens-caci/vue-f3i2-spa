/* eslint-disable */
import Feature from '@/models/Feature'
import FeatureService from '@/services/FeatureService.js'

const getters = {
  allFeatures() {
    return Feature.all()
  },
  Loaded: state => {
    return state.loaded
  },
  Owners: state => {
    return state.owners
  }
}

const actions = {
  getDigest() {
    FeatureService.getFormDigest()
      .then(response => {
        Feature.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  async getFeatures({ state, commit }) {
    let response = await FeatureService.getFeatures()
    Feature.create({ data: formatFeature(response) })
    Feature.commit(state => {
      state.loaded = true
    })
  },
  async getOwners({ state }) {
    let response = await FeatureService.getOwners()
    state.owners = formatOwners(response.data.d.results)
  },
  async addFeature({ state }, payload) {
    let response = await FeatureService.saveFeature(payload, state.digest)
    return response
  },
  async editFeature({ state }, payload) {
    // console.log('PAYLOAD: ' + payload)
    let response = await FeatureService.editFeature(payload, state.digest)
    return response
  },
  async rate({ state }, payload) {
    let response = await FeatureService.rate(payload, state.digest)
    return response
  }
}

function formatFeature(j) {
  // console.log('FORMATTING FEATURES: ' + j)
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Title: j[i]['Title'], // This is the Title column in SharePoint
      Status: j[i]['Status'],
      Product: j[i]['Product'],
      Priority: j[i]['Priority'],
      Effort: j[i]['Effort'],
      Comment: j[i]['Comment'],
      Comments: j[i]['Comments'],
      Category: j[i]['Category'],
      PercentComplete: j[i]['PercentComplete'],
      Rating: j[i]['Rating'],
      RatingData: String(j[i]['RatingData']),
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return p
}

function formatOwners(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      text: j[i]['Title'],
      value: j[i]['Id']
    })
  }
  return p
}

export default {
  getters,
  actions
}
