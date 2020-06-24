/* eslint-disable */
import Travel from '@/models/Travel'
import TravelService from '@/services/TravelService.js'
import { isNullOrUndefined } from 'util'
import moment from 'moment-timezone'

const getters = {
  allTravel() {
    return Travel.all()
  },
  newTravel() {
    return Travel.query().where('Status', 'New').get()
  },
  emailRequired: state => {
    return state.sendEmail
  },
  loaded: state => {
    return state.loaded
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
        Travel.create({ data: formatTravel(response) })
        Travel.commit(state => {
          state.loaded = true
        })
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  },
  async addTrip({ state }, payload) {
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
    return response
  },
  async editTrip({ state }, payload) {
    console.log('PAYLOAD: ' + payload)
    Travel.commit(state => {
      state.currentEvent = payload[0]
    })
    let response = await TravelService.editTrip(payload, state.digest)
    return response
  },
  async getTripById({ state }, id) {
    let trip = await Travel.query().where('Id', id).get()
    return trip
  }, 
  approveTravel({ state }, payload) {
    Travel.delete(payload.id) // this removes it from the collection but does not actually delete since we are not deleting the travel item!
    return TravelService.approveTravel(payload.id, payload.uri, payload.etag, state.digest)
    .then(response => {
      return response
    })
    .catch(error => {
      console.log('There was an error approving your travel request: ', error.response)
    })
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
  },
  async uploadTripReport({ state }, payload, buffer) {
    let report = await TravelService.uploadTripReport(payload, buffer, state.digest);
    return report
  }
}

function formatTravel(j) {
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
    }
    switch (true) {
      case diff < -6 && report == false:
        c = 'travel-no-report'
        break

      case report == true:
        c = 'travel-report'
        break

      case status == 'Approved':
        c = 'travel-approved'
        break

      case status == 'New':
        c = 'travel-new'
        break
    }
    let offset = moment().utcOffset()
    offset = offset * -1
    // console.log('UTC OFFSET: ' + offset)
    start = String(j[i]["StartDate"])
    end = String(j[i]["EndDate"])
    // console.log('1 START: ' + start + ', END: ' + end)
    start = moment(start).utc().add(offset, 'm').format()
    end = moment(end).utc().add(offset, 'm').format()
    // console.log('2 START: ' + start + ', END: ' + end)
    p.push({
      id: j[i]["Id"],
      Id: j[i]["Id"],
      Subject: j[i]["Title"] !== null ? String(j[i]["Title"]) : "",
      Status: j[i]["Status"] !== null ? String(j[i]["Status"]) : "",
      StartTime: start,
      EndTime: end,
      class: c,
      WorkPlan: j[i]["WorkPlan"] !== null ? String(j[i]["WorkPlan"]) : "",
      WorkPlanText: j[i]["WorkPlanText"] !== null ? String(j[i]["WorkPlanText"]) : "",
      WorkPlanNumber: j[i]["WorkPlanNumber"] !== null ? String(j[i]["WorkPlanNumber"]) : "",
      OriginalWorkPlanNumber: j[i]["WorkPlanNumber"] !== null ? String(j[i]["WorkPlanNumber"]) : "", // For testing if the workplan changed
      Company: j[i]["Company"] !== null ? String(j[i]["Company"]) : "",
      TravelFrom: j[i]["TravelFrom"] !== null ? String(j[i]["TravelFrom"]) : "",
      TravelTo: j[i]["TravelTo"] !== null ? String(j[i]["TravelTo"]) : "",
      Travelers: j[i]["Travelers"] !== null ? String(j[i]["Travelers"]) : "",
      Sponsor: j[i]["Sponsor"] !== null ? String(j[i]["Sponsor"]) : "",
      POCName: j[i]["POCName"] !== null ? String(j[i]["POCName"]) : "",
      POCEmail: j[i]["POCEmail"] !== null ? String(j[i]["POCEmail"]) : "",
      POCPhone: j[i]["POCPhone"] !== null ? String(j[i]["POCPhone"]) : "",
      Comments: j[i]["Comments"] !== null ? String(j[i]["Comments"]) : "",
      Clearance: j[i]["Clearance"] !== null ? String(j[i]["Clearance"]) : "",
      VisitRequest: j[i]["VisitRequest"] === true ? 'Yes' : 'No',
      EstimatedCost:
        j[i]["EstimatedCost"] !== null ? String(j[i]["EstimatedCost"]) : "",
      IndexNumber:
        j[i]["IndexNumber"] !== null ? String(j[i]["IndexNumber"]) : "",
      TripReport: !isNullOrUndefined(j[i]['TripReport']) ? String(j[i]["TripReport"]["Description"]) : "",
      TripReportLink: !isNullOrUndefined(j[i]['TripReport']) ? String(j[i]["TripReport"]["Url"]) : "",
      etag: j[i]["__metadata"]["etag"],
      uri: j[i]["__metadata"]["uri"]
    });
  }
  return p
}

export default {
  getters,
  actions
}
