/* eslint-disable */
import TravelService from '@/services/TravelService.js'
import moment from 'moment'

export const namespaced = true

export const state = {
  trips: [],
  trip: {},
  loaded: false,
  loading: true
}

export const mutations = {
  ADD_TRIPS(state, trips) {
    state.trips += trips
  },
  SET_TRIPS(state, trips) {
    state.trips = trips
  },
  SET_TRIP(state, trip) {
    state.trip = trip
  },
  SET_LOADED(state, loaded) {
    state.loaded = loaded
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_TRIP_LOADED(state, triploaded) {
    state.triploaded = triploaded
  }
}

export const actions = {
  getTRIPS({ commit }) {
    TravelService.getAllTrips()
      .then(response => {
        let isdev = false
        let location = String(window.location)
        if (location.indexOf('localhost') > 0) {
          isdev = true
        }
        if (isdev) {
          commit('SET_TRIPS', formatTravel(response.data))
          commit('SET_TRIP_LOADED', true)
        } else {
          commit('SET_TRIPS', formatTRIPs(response))
          commit('SET_TRIP_LOADED', true)
        }
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  }
}

function formatTravel(j) {
  var p = []
  for (var i = 0; i < j.length; i++) {
    p.push({
      title: j[i]['title'] !== null ? String(j[i]['title']) : '',
      start: j[i]['start'],
      end: j[i]['end'],
      rendering: j[i]['rendering'] !== null ? String(j[i]['rendering']) : '',
      classNames: j[i]['classNames']
    })
  }
  return p
}

function formatTRIPs(j) {
  var p = []
  // just loop and create the array with better keys
  for (var i = 0; i < j.length; i++) {
    if (j[i]['Title'] !== null || j[i]['Title'] !== '') {
      p.push({
        title: j[i]['TRIPTitle'],
        erpid: j[i]['Title'] !== null ? String(j[i]['Title']) : '',
        ppid:
          j[i]['PPID']['Title'] !== null ? String(j[i]['PPID']['Title']) : '',
        wid: j[i]['WorkOrderID'] !== null ? String(j[i]['WorkOrderID']) : '',
        pjm: j[i]['PjMCode']['Branch'],
        manager: j[i]['PM']['Title'],
        rdd: moment(j[i]['CustomerRDD']).isValid()
          ? moment(j[i]['CustomerRDD']).format('MM/DD/YYYY')
          : '',
        astart: moment(j[i]['ActualStart']).isValid()
          ? moment(j[i]['ActualStart']).format('MM/DD/YYYY')
          : '',
        pfinish: moment(j[i]['PlannedFinish']).isValid()
          ? moment(j[i]['PlannedFinish']).format('MM/DD/YYYY')
          : ''
      })
    }
  }
  return p
}
