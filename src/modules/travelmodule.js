// import Vue from 'vue'
import Travel from '@/models/Travel'
import TravelService from '@/services/TravelService.js'
import { isNullOrUndefined } from 'util'
import moment from 'moment-timezone'

const getters = {
  allTravel() {
    return Travel.all()
  },
  newTravel() {
    return Travel.query()
      .where('Status', 'New')
      .get()
  },
  emailRequired: state => {
    return state.sendEmail
  },
  AFRLReview: state => {
    return state.afrltrips
  },
  loaded: state => {
    return state.loaded
  },
  triploaded: state => {
    return state.triploaded
  },
  selectedtrip: state => {
    return state.selectedtrip
  }
}

const actions = {
  async getDigest() {
    let response = await TravelService.getFormDigest()
    /* if (console) {
      console.log('TravelModule DIGEST: ' + response)
    } */
    Travel.commit(state => {
      state.digest = response.data.d.GetContextWebInformation.FormDigestValue
    })
    return response
  },
  async getTRIPS() {
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
  async getAFRLTrips() {
    TravelService.getAFRLTrips()
      .then(response => {
        Travel.commit(state => {
          state.afrltrips = formatTravel(response)
        })
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  },
  async addTrip({ state }, payload) {
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
    // console.log('PAYLOAD: ' + payload)
    Travel.commit(state => {
      state.currentEvent = payload[0]
    })
    let response = await TravelService.editTrip(payload, state.digest)
    return response
  },
  async editTraveler({ state }, payload) {
    // console.log('PAYLOAD: ' + payload)
    Travel.commit(state => {
      state.currentEvent = payload[0]
    })
    let response = await TravelService.editTraveler(payload, state.digest)
    return response
  },
  async editTravelData({ state }, payload) {
    let response = await TravelService.editTravelData(payload, state.digest)
    return response
  },
  async getTripById({ state }, payload) {
    // console.log('PAYLOAD: ' + payload.id)
    let trip = await TravelService.getTripById(state.triploaded, payload.id)
    Travel.commit(state => {
      state.triploaded = true
      state.selectedtrip = formatTrip(trip)
    })
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
  NewTripEmail({ state }, payload) {
    TravelService.NewTripEmail(state, state.digest, payload)
      .then(response => {
        return response
      })
      .catch(error => {
        console.log('There was an error sending email: ', error.response)
      })
  },
  EditTripEmail({ state }, payload) {
    TravelService.EditTripEmail(state, state.digest, payload)
      .then(response => {
        return response
      })
      .catch(error => {
        console.log('There was an error sending email: ', error.response)
      })
  },
  async uploadTripReport({ state }, payload) {
    payload.state = state
    let report = await TravelService.uploadTripReport(payload)
    return report
  },
  async getReportItem({ state }, uri) {
    let response = await TravelService.getReportItem(state, uri)
    return response
  },
  async updateReportItem({ state }, payload) {
    let response = await TravelService.updateReportItem(payload, state.digest)
    return response
  },
  async editTripReport({ state }, payload) {
    let response = await TravelService.editTripReport(payload, state.digest)
    return response
  }
}

function formatTrip(j) {
  let p = {}
  let start = moment(j[0]['StartDate']).isValid() ? moment(j[0]['StartDate']) : ''
  let end = moment(j[0]['EndDate']).isValid() ? moment(j[0]['EndDate']) : ''
  let actioncompleted = moment(j[0]['SecurityActionCompleted']).isValid() ? moment(j[0]['SecurityActionCompleted']) : ''
  let approvedon = moment(j[0]['OCONUSApprovedOn']).isValid() ? moment(j[0]['OCONUSApprovedOn']) : ''
  let offset = moment().utcOffset()
  offset = offset * -1
  if (offset === 240) {
    offset = 300
  } // weird DST quirk
  start = String(j[0]['StartDate'])
  end = String(j[0]['EndDate'])
  let created = String(j[0]['Created'])
  start = moment(start)
    .utc()
    .add(offset, 'm')
    .format()
  end = moment(end)
    .utc()
    .add(offset, 'm')
    .format()
  created = moment(created)
    .utc()
    .add(offset, 'm')
    .format()
  if (actioncompleted != '') {
    actioncompleted = moment(created)
      .utc()
      .add(offset, 'm')
      .format()
  }
  if (approvedon != '') {
    approvedon = moment(created)
      .utc()
      .add(offset, 'm')
      .format()
  }
  p.id = j[0]['Id']
  p.Id = j[0]['Id']
  p.Subject = j[0]['Title'] !== null ? String(j[0]['Title']) : ''
  p.Status = j[0]['Status'] !== null ? String(j[0]['Status']) : ''
  p.Created = created
  p.CreatedBy = j[0]['Author']['Title']
  p.CreatedByEmail = j[0]['Author']['EMail']
  p.StartTime = start
  p.EndTime = end
  p.WorkPlan = j[0]['WorkPlan'] !== null ? String(j[0]['WorkPlan']) : ''
  p.WorkPlanText = j[0]['WorkPlanText'] !== null ? String(j[0]['WorkPlanText']) : ''
  p.WorkPlanNumber = j[0]['WorkPlanNumber'] !== null ? String(j[0]['WorkPlanNumber']) : ''
  p.OriginalWorkPlanNumber = j[0]['WorkPlanNumber'] !== null ? String(j[0]['WorkPlanNumber']) : '' // For testing if the workplan changed
  p.OCONUS = j[0]['OCONUS'] !== null ? String(j[0]['OCONUS']) : ''
  p.OCONUSLocation = j[0]['OCONUSLocation'] !== null ? String(j[0]['OCONUSLocation']) : 'Select...'
  p.OCONUSApprovedBy = j[0]['OCONUSApprovedBy'] !== null ? String(j[0]['OCONUSApprovedBy']) : ''
  p.OCONUSApprovedOn = approvedon
  p.OCONUSApprovedEmail = j[0]['OCONUSApprovedEmail'] !== null ? String(j[0]['OCONUSApprovedEmail']) : ''
  p.PreApproved = j[0]['PreApproved'] !== null ? String(j[0]['PreApproved']) : 'Select...'
  p.Company = j[0]['Company'] !== null ? String(j[0]['Company']) : ''
  p.TravelFrom = j[0]['TravelFrom'] !== null ? String(j[0]['TravelFrom']) : ''
  p.TravelTo = j[0]['TravelTo'] !== null ? String(j[0]['TravelTo']) : ''
  p.Travelers = j[0]['Travelers'] !== null ? String(j[0]['Travelers']) : ''
  p.TravelersText = j[0]['TravelersText'] !== null ? String(j[0]['TravelersText']) : ''
  p.Sponsor = j[0]['Sponsor'] !== null ? String(j[0]['Sponsor']) : ''
  p.POCName = j[0]['POCName'] !== null ? String(j[0]['POCName']) : ''
  p.POCEmail = j[0]['POCEmail'] !== null ? String(j[0]['POCEmail']) : ''
  p.POCPhone = j[0]['POCPhone'] !== null ? String(j[0]['POCPhone']) : ''
  p.Comments = j[0]['Comments'] !== null ? String(j[0]['Comments']) : ''
  p.Clearance = j[0]['Clearance'] !== null ? String(j[0]['Clearance']) : ''
  p.InternalData = j[0]['InternalData'] !== null ? String(j[0]['InternalData']) : ''
  p.VisitRequest = j[0]['VisitRequest'] === 'Yes' ? 'Yes' : 'No'
  p.SecurityAction = j[0]['SecurityAction'] !== null ? String(j[0]['SecurityAction']) : ''
  p.SecurityActionCompleted = actioncompleted
  p.EstimatedCost = j[0]['EstimatedCost'] !== null ? String(j[0]['EstimatedCost']) : ''
  p.IndexNumber = j[0]['IndexNumber'] !== null ? String(j[0]['IndexNumber']) : ''
  p.etag = j[0]['__metadata']['etag']
  p.uri = j[0]['__metadata']['uri']
  return p
}

function formatTravel(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    let start = moment(j[i]['StartDate']).isValid() ? moment(j[i]['StartDate']) : ''
    let end = moment(j[i]['EndDate']).isValid() ? moment(j[i]['EndDate']) : ''
    let actioncompleted = moment(j[i]['SecurityActionCompleted']).isValid() ? moment(j[i]['SecurityActionCompleted']) : ''
    let approvedon = moment(j[i]['OCONUSApprovedOn']).isValid() ? moment(j[i]['OCONUSApprovedOn']) : ''
    let offset = moment().utcOffset()
    offset = offset * -1
    if (offset === 240) {
      offset = 300
    } // weird DST quirk
    start = String(j[i]['StartDate'])
    end = String(j[i]['EndDate'])
    let created = String(j[i]['Created'])
    start = moment(start)
      .utc()
      .add(offset, 'm')
      .format()
    end = moment(end)
      .utc()
      .add(offset, 'm')
      .format()
    created = moment(created)
      .utc()
      .add(offset, 'm')
      .format()
    if (actioncompleted != '') {
      actioncompleted = moment(created)
        .utc()
        .add(offset, 'm')
        .format()
    }
    if (approvedon != '') {
      approvedon = moment(created)
        .utc()
        .add(offset, 'm')
        .format()
    }
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Subject: j[i]['Title'] !== null ? String(j[i]['Title']) : '',
      Status: j[i]['Status'] !== null ? String(j[i]['Status']) : '',
      Created: created,
      StartTime: start,
      EndTime: end,
      WorkPlan: j[i]['WorkPlan'] !== null ? String(j[i]['WorkPlan']) : '',
      WorkPlanText: j[i]['WorkPlanText'] !== null ? String(j[i]['WorkPlanText']) : '',
      WorkPlanNumber: j[i]['WorkPlanNumber'] !== null ? String(j[i]['WorkPlanNumber']) : '',
      OriginalWorkPlanNumber: j[i]['WorkPlanNumber'] !== null ? String(j[i]['WorkPlanNumber']) : '', // For testing if the workplan changed
      OCONUS: j[i]['OCONUS'] !== null ? String(j[i]['OCONUS']) : '',
      OCONUSLocation: j[i]['OCONUSLocation'] !== null ? String(j[i]['OCONUSLocation']) : '',
      OCONUSApprovedBy: j[i]['OCONUSApprovedBy'] !== null ? String(j[i]['OCONUSApprovedBy']) : '',
      OCONUSApprovedOn: approvedon,
      OCONUSApprovedEmail: j[i]['OCONUSApprovedEmail'] !== null ? String(j[i]['OCONUSApprovedEmail']) : '',
      PreApproved: j[i]['PreApproved'] !== null ? String(j[i]['PreApproved']) : '',
      Company: j[i]['Company'] !== null ? String(j[i]['Company']) : '',
      TravelFrom: j[i]['TravelFrom'] !== null ? String(j[i]['TravelFrom']) : '',
      TravelTo: j[i]['TravelTo'] !== null ? String(j[i]['TravelTo']) : '',
      Travelers: j[i]['Travelers'] !== null ? String(j[i]['Travelers']) : '',
      TravelersText: j[i]['Travelers'] !== null ? String(j[i]['TravelersText']) : '',
      Sponsor: j[i]['Sponsor'] !== null ? String(j[i]['Sponsor']) : '',
      POCName: j[i]['POCName'] !== null ? String(j[i]['POCName']) : '',
      POCEmail: j[i]['POCEmail'] !== null ? String(j[i]['POCEmail']) : '',
      POCPhone: j[i]['POCPhone'] !== null ? String(j[i]['POCPhone']) : '',
      Comments: j[i]['Comments'] !== null ? String(j[i]['Comments']) : '',
      Clearance: j[i]['Clearance'] !== null ? String(j[i]['Clearance']) : '',
      InternalData: j[i]['InternalData'] !== null ? String(j[i]['InternalData']) : '',
      VisitRequest: j[i]['VisitRequest'] === 'Yes' ? 'Yes' : 'No',
      SecurityAction: j[i]['SecurityAction'] !== null ? String(j[i]['SecurityAction']) : '',
      SecurityActionCompleted: actioncompleted,
      EstimatedCost: j[i]['EstimatedCost'] !== null ? String(j[i]['EstimatedCost']) : '',
      IndexNumber: j[i]['IndexNumber'] !== null ? String(j[i]['IndexNumber']) : '',
      Title: j[i]['IndexNumber'] + '-' + j[i]['Title'],
      TripReport: !isNullOrUndefined(j[i]['TripReport']) ? String(j[i]['TripReport']['Description']) : '',
      TripReportLink: !isNullOrUndefined(j[i]['TripReport']) ? String(j[i]['TripReport']['Url']) : '',
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  /* p = Vue._.orderBy(p, 'Id', 'desc') */
  return p
}

export default {
  getters,
  actions
}
