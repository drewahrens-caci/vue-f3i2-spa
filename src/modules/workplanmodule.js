/* eslint-disable */
import Vue from 'vue'
import Workplan from '@/models/WorkPlan'
import WorkplanService from '@/services/WorkplanService.js'
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
  },
  Managers: state => {
    return state.managers
  },
  Subs: state => {
    return state.subs
  },
  SubsLoaded: state => {
    return state.subsloaded
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
    Workplan.create({ data: formatWorkplan(response) })
    Workplan.commit(state => {
      state.loaded = true
    })
    state.dropdown = formatDropdown(response)
  },
  async getManagers({ state }) {
    let response = await WorkplanService.getManagers()
    state.managers = formatManagers(response.data.d.results)
  },
  async getManagerByWPNumber({ state }, payload) {
    let response = await WorkplanService.getManagerByWPNumber(state, payload)
    return response
  },
  async getSubs({ state }, payload) {
    let response = await WorkplanService.getSubs(payload)
    state.subs = String(response[0]['Subs'])
    state.subsloaded = true
  },
  async addWorkplan({ state }, payload) {
    let response = await WorkplanService.saveWorkplan(payload, state.digest, 'new')
    return response
  },
  async editWorkplan({ state }, payload) {
    let response = await WorkplanService.saveWorkplan(payload, state.digest, 'edit')
    return response
  },
  async saveWorkplanSubs({ state }, payload) {
    let response = await WorkplanService.saveWorkplanSubs(payload, state.digest)
    return response
  },
  async updateIndex({ state }, payload) {
    let response = await WorkplanService.updateIndex(payload, state.digest)
    return response
  },
  async archive({ state }, payload) {
    let response = await WorkplanService.archive(payload, state.digest)
    return response
  }
}

function formatWorkplan(j) {
  // console.log('FORMATTING WORKPLANS: ' + j)
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Title: j[i]['Title'], // This is the Title column in SharePoint
      Number: j[i]['Number'],
      Revision: j[i]['Revision'],
      Subs: j[i]['Subs'],
      POPStart: moment(j[i]['POPStart']).isValid() ? moment(j[i]['POPStart']).format('MM/DD/YYYY') : '',
      POPEnd: moment(j[i]['POPEnd']).isValid() ? moment(j[i]['POPEnd']).format('MM/DD/YYYY') : '',
      DateApproved: moment(j[i]['DateApproved']).isValid() ? moment(j[i]['DateApproved']).format('MM/DD/YYYY') : '',
      Manager: j[i]['Manager']['Title'],
      ManagerId: j[i]['Manager']['ID'],
      ManagerEmail: j[i]['Manager']['EMail'],
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return p
}

function formatDropdown(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    let value = j[i]['Number'] + ', ' + j[i]['Title'] + ', ' + j[i]['Revision'] + ', ' + j[i]['LastIndex'] + ', ' + j[i]['__metadata']['uri'] + ', ' + j[i]['__metadata']['etag']
    p.push({
      text: j[i]['Number'] + ' ' + j[i]['Title'],
      value: j[i]['Number'],
      data: value
    })
  }
  p = Vue._.orderBy(p, 'value', 'asc')
  return p
}

function formatManagers(j) {
  // console.log('FORMAT MANAGERS: ' + j)
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
