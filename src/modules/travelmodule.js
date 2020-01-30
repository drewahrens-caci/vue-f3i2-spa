/* eslint-disable */
import Travel from '@/models/Travel'
import TravelService from '@/services/TravelService.js'
import { isNullOrUndefined } from 'util'
import moment from 'moment'

const getters = {
  allTravel() {
    return Travel.all()
  },
  emailRequired: state => {
    return state.sendEmail
  }
}

const actions = {
  getDigest() {
    TravelService.getFormDigest()
      .then(response => {
        Travel.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  getTRIPS({ state, commit }) {
    TravelService.getAllTrips()
      .then(response => {
        Travel.insert({ data: formatTravel(response) })
        Travel.commit(state => {
          state.loaded = true
        })
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  },
  async addTrip({ state, commit }, payload) {
    console.log('PAYLOAD: ' + payload)
    Travel.commit(state => {
      state.currentEvent = payload[0]
    })
    let requestrequired = payload[0].VisitRequest
    if (requestrequired === 'yes') {
      Travel.commit(state => {
        state.sendEmail = true
      })
    }
    let response = await TravelService.addTrip(payload, state.digest)
    // let id = await response.d.ID
    // console.log('ADD TRIP RESPONSE: ' + response)
    return response

    /* TravelService.addTrip(payload, state.digest)
      .then(function(response) {
        console.log('ADD TRIP RESPONSE: ' + response)
        return response
      })
      .catch(error => {
        console.log('There was an error added the trip to SharePoint: ', error.response)
      }) */
  },
  createTodo({ state, commit }) {
    // this will be called if there is a need to send security notice
  },
  sendEmail({ state }, id) {
    // send email to security that this request needs to have security paperwork
    TravelService.sendEmail(state.currentEvent, state.digest, id)
      .then(response => {
        return response
      })
      .catch(error => {
        console.log('There was an error sending email: ', error.response)
      })
  }
}

function formatTravel(j) {
  console.log(j.length + ', ' + j[0]['Title'])
  let p = []
  for (let i = 0; i < j.length; i++) {
    let c = ''
    let report = isNullOrUndefined(j[i]['TripReport']) === true ? false : true
    let status = j[i]['Status']
    let start = moment(j[i]['StartDate']).isValid()
      ? moment(j[i]['StartDate'])
      : ''
    let end = moment(j[i]['EndDate']).isValid() ? moment(j[i]['EndDate']) : ''
    let today = moment()
    let diff = 0
    if (end !== '') {
      diff = end.diff(today, 'days')
      console.log('end: ' + end.format('MM/DD/YYYY') + ', diff: ' + diff)
    } else {
      if (start !== '') {
        diff = start.diff(today, 'days')
        console.log('start: ' + start.format('MM/DD/YYYY') + ', diff: ' + diff)
      }
    }
    switch (true) {
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
    start = moment(start).format('MM/DD/YYYY')
    end = moment(end).format('MM/DD/YYYY')
    p.push({
      Id: j[i]['Id'],
      Subject: j[i]['Title'] !== null ? String(j[i]['Title']) : '',
      StartTime: start,
      EndTime: end,
      class: c,
      WorkPlan: j[i]['WorkPlan'] !== null ? String(j[i]['WorkPlan']) : '',
      Company: j[i]['Company'] !== null ? String(j[i]['Company']) : '',
      TravelFrom: j[i]['TravelFrom'] !== null ? String(j[i]['TravelFrom']) : '',
      TravelTo: j[i]['TravelTo'] !== null ? String(j[i]['TravelTo']) : '',
      Travelers: j[i]['Travelers'] !== null ? String(j[i]['Travelers']) : '',
      Sponsor: j[i]['Sponsor'] !== null ? String(j[i]['Sponsor']) : '',
      POCName: j[i]['POCName'] !== null ? String(j[i]['POCName']) : '',
      POCEmail: j[i]['POCEmail'] !== null ? String(j[i]['POCEmail']) : '',
      POCPhone: j[i]['POCPhone'] !== null ? String(j[i]['POCPhone']) : '',
      Comments: j[i]['Comments'] !== null ? String(j[i]['Comments']) : '',
      Clearance: j[i]['Clearance'] !== null ? String(j[i]['Clearance']) : '',
      VisitRequest: j[i]['VisitRequest'] !== null ? j[i]['VisitRequest'] : '',
      EstimatedCost: j[i]['EstimatedCost'] !== null ? String(j[i]['EstimatedCost']) : '',
      IndexNumber:
        j[i]['IndexNumber'] !== null ? String(j[i]['IndexNumber']) : ''
    })
  }
  return p
}

export default {
  getters,
  actions
}
