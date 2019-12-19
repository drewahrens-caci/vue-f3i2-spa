/* eslint-disable */
import MilestoneService from '@/services/MilestoneService.js'
import UtilityService from '@/services/UtilityService.js'
import moment from 'moment'

export const namespaced = true

function predicateBy(prop) {
  return function(a, b) {
    if (a[prop] > b[prop]) {
      return 1
    } else if (a[prop] < b[prop]) {
      return -1
    }
    return 0
  }
}

export const state = {
  erpid: null,
  milestones: [],
  allmilestones: [],
  sorted: [],
  sortedTotal: 0,
  milestone: {},
  milestonesTotal: 0,
  allmilestonesTotal: 0,
  orderoptions: [],
  digest: null,
  loaded: false,
  loading: false,
  saved: false,
  refresh: false,
  allloaded: false,
  allloading: false,
  ganttloaded: false,
  ganttloading: false
}

export const mutations = {
  ADD_MILESTONE(state, milestone) {
    state.milestones.push(milestone)
  },
  SET_MILESTONES(state, milestones) {
    state.milestones = milestones
    console.log('Milestones added to store')
  },
  SET_MILESTONE(state, milestone) {
    state.milestone = milestone
  },
  SET_MILESTONES_TOTAL(state, pt) {
    state.milestonesTotal = pt
  },
  SET_DIGEST(state, digest) {
    state.digest = digest
  },
  SET_LOADED(state, loaded) {
    state.loaded = loaded
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_SAVED(state, saved) {
    state.saved = saved
  },
  SET_REFRESH(state, refresh) {
    state.refresh = refresh
  },
  SET_ALL_LOADED(state, loaded) {
    state.allloaded = loaded
  },
  SET_ALL_LOADING(state, loading) {
    state.allloading = loading
  },
  SET_SORTED(state, sorted) {
    state.sorted = sorted
  },
  SET_GANTTLOADED(state, loaded) {
    state.ganttloaded = loaded
  },
  SET_GANTTLOADING(state, loading) {
    state.ganttloading = loading
  }
}

export const actions = {
  getMilestonesByERP({ state, commit }, erpid) {
    state.erpid = erpid // useful when doing an update so that we have the erpid to reload
    console.log('Calling Milestone Service with ERPID: ' + erpid)
    commit('SET_LOADING', true)
    if (erpid === undefined || erpid === null) {
      erpid = state.erpid
    } // supports updating in dev mode as the erpid is lost on return
    MilestoneService.getMilestonesByERP(erpid)
      .then(response => {
        // Service already formats DEV but DEV has a different response type so the return is slightly different
        let isdev = false
        let location = String(window.location)
        if (location.indexOf('localhost') > 0) {
          isdev = true
        }
        if (isdev) {
          commit('SET_MILESTONES_TOTAL', parseInt(response.data.length))
          commit('SET_MILESTONES', response.data)
          commit('SET_LOADED', true)
          commit('SET_LOADING', false)
        } else {
          commit('SET_MILESTONES_TOTAL', parseInt(response.length))
          // format the response from the service to match desired json format
          commit('SET_MILESTONES', formatMilestones(response))
          commit('SET_LOADED', true)
          commit('SET_LOADING', false)
        }
      })
      .catch(error => {
        // TODO: Let the user know!!
        console.log('There was an error: ', error.response)
      })
  },
  getFormDigest({ commit }) {
    let location = String(window.location)
    if (location.indexOf('localhost') > 0) {
    } else {
      MilestoneService.getFormDigest()
        .then(response => {
          commit(
            'SET_DIGEST',
            response.data.d.GetContextWebInformation.FormDigestValue
          )
        })
        .catch(error => {
          console.log('Error getting form digest: ' + error.response)
        })
    }
  },
  updateMilestones({ state, commit }) {
    commit('UPDATE_MILESTONES', state.milestones)
  },
  updateDevMilestones({ state, commit }) {
    var vm = this
    commit('SET_LOADING', true)
    MilestoneService.updateDevMilestones(state.sorted, state.milestones)
      .then(response => {
        commit('SET_LOADED', true)
        commit('SET_LOADING', false)
        commit('SET_SAVED', true)
        commit('SET_REFRESH', true)
      })
      .catch(error => {
        // TODO: Let the user know!!
        console.log(
          'There was an error updating dev milestones: ',
          error.response
        )
      })
  },
  setSaved({ commit }, saved) {
    commit('SET_SAVED', saved)
  },
  setRefresh({ commit }, refresh) {
    commit('SET_REFRESH', refresh)
  },
  setSortOrder({ commit }, order) {
    commit('SET_SORTED', order)
  },
  addMilestone({ state, commit }, title, erpid) {
    commit(
      'ADD_MILESTONE',
      buildMilestone(title, state.erpid, state.milestones.length)
    )
    commit('SET_MILESTONES_TOTAL', parseInt(state.milestones.length))
  },
  updateSPMilestones({ state, commit }) {
    // send milestones to Milestone service to create/update as needed
    var vm = this
    commit('SET_LOADING', true)
    return MilestoneService.updateMilestones(
      state.sorted,
      state.milestones,
      state.digest
    )
      .then(response => {
        commit('SET_LOADED', true)
        commit('SET_LOADING', false)
        commit('SET_SAVED', true)
        commit('SET_REFRESH', true)
        /* MilestoneService.getMilestonesByERP(state.erpid)
          .then(response => {
            commit('SET_MILESTONES_TOTAL', parseInt(response.length))
            commit('SET_MILESTONES', formatMilestones(response))
            commit('SET_LOADED', true)
            commit('SET_LOADING', false)
          })
          .catch(error => {
            console.log('There was an error: ', error.response)
          }) */
      })
      .catch(error => {
        // TODO: Let the user know!!
        console.log('There was an error updating milestones: ', error.response)
      })
  }
}

export const getters = {
  getMilestones(state) {
    return state.milestones
  }
}

function buildOrderOps(z) {
  var p = []
  for (var i = 0; i < z; i++) {
    p.push(i + 1)
  }
  return p
}

function buildMilestone(title, erpid, length) {
  /* let isdev = false
  let location = String(window.location)
  if (location.indexOf('localhost') > 0) {
    isdev = true
  } */
  let M = {
    _rowVariant: '',
    index: length + 1,
    guid: Math.uuid(),
    id: 0,
    erpid: erpid,
    RootCauses: [],
    order: length + 1,
    cp: '',
    cd: '',
    title: title,
    delid: '',
    FY: '',
    mdps: '',
    mdpf: '',
    mdas: '',
    mdaf: '',
    duration: 0,
    pcomp: 0,
    pqty: 0,
    aqty: 0,
    oqty: 0,
    units: '',
    status: '',
    rcc: '',
    rc: '',
    phase: '',
    category: '',
    leadwc: '',
    dl: 0,
    duration: 0,
    comms: '',
    etag: null,
    uri: null,
    delete: 'N'
  }
  return M
}

function formatMilestones(j) {
  // We track the root cause and root cause categories in a separate list so they will be retrieved as a separate action based on the erpid and milestone id
  var p = []
  // just loop and create the array with better keys
  for (var i = 0; i < j.length; i++) {
    let m = buildMilestone(j[i]['MilestoneTitle'], j[i]['ERPID'], i)
    m.index = i
    m.id = j[i]['ID']
    m.order = i + 1
    m.cp = j[i]['CriticalPath']
    m.cd = j[i]['CustomerDeliverable']
    m.delid = j[i]['DeliverableID']
    m.FY = j[i]['FiscalYear']
    m.mdps = moment(j[i]['PlannedStart']).isValid() ? moment(j[i]['PlannedStart']).format('MM/DD/YYYY') : ''
    m.mdpf = moment(j[i]['PlannedFinish']).isValid() ? moment(j[i]['PlannedFinish']).format('MM/DD/YYYY') : ''
    m.mdas = moment(j[i]['ActualStart']).isValid() ? moment(j[i]['ActualStart']).format('MM/DD/YYYY') : ''
    m.mdaf = moment(j[i]['ProjectedFinish']).isValid() ? moment(j[i]['ProjectedFinish']).format('MM/DD/YYYY') : ''
    m.duration = j[i]['Duration']
    m.pcomp = j[i]['PercentComplete']
    m.pqty = j[i]['PlannedQuantity']
    m.aqty = j[i]['ActualQuantity']
    m.oqty = j[i]['OnTimeQuantity']
    m.units = j[i]['Units']
    m.status = j[i]['MilestoneStatus']
    m.rcc = j[i]['RootCauseCategory']
    m.rc = j[i]['RootCause']
    m.phase = j[i]['MilestonePhase'] // This will only be present for template based milestones for now
    m.category = j[i]['MilestoneCategory'] // This will only be present for template based milestones for now
    m.leadwc = j[i]['LeadWorkCenter']
    m.dl = 0 // This will be calculated and is just used as a place holder. May be able to remove.
    m.comms = j[i]['Comments']
    m.etag = j[i]['__metadata']['etag'] // This is used when updating the data.
    m.uri = j[i]['__metadata']['uri'] // This is used when updating the data.
    m.delete = 'N'
    p.push(m)
  }
  return p
}
