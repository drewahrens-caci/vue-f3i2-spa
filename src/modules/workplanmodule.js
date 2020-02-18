/* eslint-disable */
import Workplan from '@/models/WorkPlan'
import WorkplanService from '@/services/WorkplanService.js'
import { isNullOrUndefined } from 'util'
import moment from 'moment'

const getters = {
  allWorkplans() {
    return Workplan.all()
  },
  DropDown: state => {
    return state.dropdown
  },
  Loaded: state => {
    return state.loaded
  }
}

const actions = {
  getDigest() {
    WorkplanService.getFormDigest()
      .then(response => {
        Workplan.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  async getWorkplans({ state, commit }) {
    let response = await WorkplanService.getWorkPlans()
    Workplan.insert({ data: formatWorkplan(response) })
    Workplan.commit(state => {
      state.loaded = true
    })
    state.dropdown = formatDropdown(response)
  },
  async addWorkplan({ state, commit }, payload) {
    // console.log('PAYLOAD: ' + payload)
    let response = await WorkplanService.addWorkplan(payload, state.digest)
    return response
  }
}

function formatWorkplan(j) {
  // console.log(j.length + ', ' + j[0]['Title'])
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Title: j[i]['Title'], // This is the Title column in SharePoint
      Number: j[i]['Number'],
      Revision: j[i]['Revision'],
      Manager: j[i]['Manager'],
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return p
}

function formatDropdown(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    let text = j[i]['Number'] + ', ' + j[i]['Title']
    text += !isNullOrUndefined(j[i]['Revision']) ? ', Rev: ' + j[i]['Revision'] : ''
    p.push({
      text: text,
      value: j[i]['Number']
    })
  }
  return p
}

export default {
  getters,
  actions
}
