/* eslint-disable */
import Bug from '@/models/Bug'
import BugService from '@/services/BugService.js'

const getters = {
  allBugs() {
    return Bug.all()
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
    BugService.getFormDigest()
      .then(response => {
        Bug.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  async getBugs({ state, commit }) {
    let response = await BugService.getBugs()
    Bug.create({ data: formatBug(response) })
    Bug.commit(state => {
      state.loaded = true
    })
  },
  async getOwners({ state }) {
    let response = await BugService.getOwners()
    state.owners = formatOwners(response.data.d.results)
  },
  async addBug({ state }, payload) {
    let response = await BugService.saveBug(payload, state.digest)
    return response
  },
  async editBug({ state }, payload) {
    console.log('PAYLOAD: ' + payload)
    let response = await BugService.editBug(payload, state.digest)
    return response
  },
  async rate({ state }, payload) {
    let response = await BugService.rate(payload, state.digest)
    return response
  }
}

function formatBug(j) {
  // console.log('FORMATTING WORKPLANS: ' + j)
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Title: j[i]['Title'], // This is the Title column in SharePoint
      BugDescription: j[i]['BugDescription'],
      Status: j[i]['Status'],
      Priority: j[i]['Priority'],
      Effort: j[i]['Effort'],
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
