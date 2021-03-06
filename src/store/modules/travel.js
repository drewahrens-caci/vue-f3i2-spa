/* eslint-disable */
import TravelService from '@/services/TravelService.js'
import { isNullOrUndefined } from 'util'
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
        commit('SET_TRIPS', formatTravel(response))
        commit('SET_TRIP_LOADED', true)
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  }
}

function formatTravel(j) {
  console.log(j.length + ', ' + j[0]['Title'])
  var p = []
  for (var i = 0; i < j.length; i++) {
    var c = ''
    var classes = []
    var report = isNullOrUndefined(j[i]['TripReport']) === true ? false : true 
    var status = j[i]['Status']
    var start = moment(j[i]['StartDate']).isValid() ? moment(j[i]['StartDate']) : ''
    var end = moment(j[i]['EndDate']).isValid() ? moment(j[i]['EndDate']) : ''
    var today = moment()
    var diff = 0
    if (end !== '') {
      diff = end.diff(today, 'days')
      console.log('end: ' + end.format('MM/DD/YYYY') + ', diff: ' + diff)
    } else {
      if (start !== '') {
        diff = start.diff(today, 'days')
        console.log('start: ' + start.format('MM/DD/YYYY') + ', diff: ' + diff)
      }
    }
    switch(true) {
      case diff < -4 && report == false:
        c = 'travel-no-report'
        break

      case diff < -4 && report == true:
        c = 'travel-report'
        break

      case status == 'Approved':
        c = 'travel-approved'
        break

      case status == 'New':
        c = 'travel-new'
        break
    }
    // classes.push(c)
    /* start = moment(start).toDate()
    end = moment(end).toDate() */
    start = moment(start).format('MM/DD/YYYY')
    end = moment(end).format('MM/DD/YYYY')
    /* start = new Date(j[i]['StartDate'])
    end = new Date(j[i]['EndDate']) */
    // start = Date.UTC(start.getFullYear(), start.getMonth() + 1, start.getDate())
    // end = Date.UTC(end.getFullYear(), end.getMonth() + 1, end.getDate())
    p.push({
      Id: j[i]['Id'],
      Subject: j[i]['Title'] !== null ? String(j[i]['Title']) : '',
      StartTime: start,
      EndTime: end,
      class: c
    })
  }
  return p
}

