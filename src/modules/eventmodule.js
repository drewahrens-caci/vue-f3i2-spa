/* eslint-disable */
import Event from '@/models/Event'
import EventService from '@/services/EventService.js'
import { isNullOrUndefined } from 'util'
import moment from 'moment'
import timezone from 'moment-timezone'


const getters = {
  allEvents() {
    return Event.all()
  },
  loaded: state => {
    return state.loaded
  },
  digest: state => {
    return state.digest
  }
}

const actions = {
  getDigest() {
    EventService.getFormDigest()
      .then(response => {
        Event.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
          return response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  getCamlEvents({ state }) {
    // console.log('GET CAML EVENTS: ' + state.digest)
    EventService.getEventsByCaml(state.digest)
      .then(response => {
        console.log('EVENTS BY CAML RESPONSE: ' + response)
        Event.create({ data: formatEvent(response) })
        Event.commit(state => {
          state.loaded = true
        })
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  },
  getEvents({ state, commit }) {
    EventService.getAllEvents()
      .then(response => {
        Event.create({ data: formatEvent(response) })
        Event.commit(state => {
          state.loaded = true
        })
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  },
  async addEvent({ state }, payload) {
    // console.log('PAYLOAD: ' + payload)
    Event.commit(state => {
      state.currentEvent = payload[0]
    })
    let response = await EventService.addEvent(payload, state.digest)
    return response
  },
  async editEvent({ state }, payload) {
    // console.log('PAYLOAD: ' + payload)
    Event.commit(state => {
      state.currentEvent = payload[0]
    })
    let response = await EventService.editEvent(payload, state.digest)
    return response
  },
  async getEventById({ state }, id) {
    let event = await Event.query().where('Id', id).get()
    return event
  }
}

function formatEvent(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    let c = ''
    let category = isNullOrUndefined(j[i]['Categories']) === true ? '' : j[i]['Categories']
    // console.log('SETTING CATEGORY: ' + category)
    switch (category) {
      case 'Checkpoints':
        c = 'checkpoints'
        break

      case 'Milestones':
        c = 'milestones'
        break

      case 'Predecessor Event':
        c = 'predecessor'
        break

      case 'PTO':
        c = 'pto'
        break
      
      case 'Recurring Events':
        c = 'recurring'
        break
      
      case 'TDY':
        c = 'tdy'
        break
      
      default:
        c = 'edefault'
        break
    }
    let offset = timezone().utcOffset()
    offset = offset * -1
    if (offset === 240) { offset = 300 } // weird DST quirk
    // console.log('UTC OFFSET: ' + offset)
    let allday = j[i]["fAllDayEvent"]
    let recurrence = j[i]["fRecurrence"]
    let rdata = String(j[i]["RecurrenceData"])
    let start = j[i]["EventDate"]
    let end = j[i]["EndDate"]
    let FREQ = ''
    let INTERVAL = 1
    let COUNT = 1
    let RecurrenceRule = ''
    // console.log('1 START: ' + start + ', END: ' + end + ', AllDay: ' + allday + ', TITLE: ' + String(j[i]["Title"]))
    start = moment(start).utc().add(offset, 'minutes').format()
    end = moment(end).utc().add(offset, 'minutes').format()
    start = timezone.tz(start, 'America/New_York').format()
    end = timezone.tz(end, 'America/New_York').format()
    let startyear = moment(start).year()
    let endyear = moment(end).year()
    // console.log('1.1 STARTYEAR: ' + startyear + ', ENDYEAR: ' + endyear + ', TYPE: ' + typeof(startyear))
    if (allday === true || allday === 'true') {
      endyear = startyear
      end = moment(start).add(1, 'hours').format()
      // console.log('1.5 ALLDAY END: ' + end)
    }
    if (recurrence === true || recurrence === 'true') {
      endyear = startyear
      // console.log('RECURRENCE DATA: ' + rdata)
      // need to determine recurrence rule so we know when to draw recurring events
      if (rdata.indexOf("mo='TRUE' weekFrequency='1'") >= 0) { FREQ = 'WEEKLY' }
      if (rdata.indexOf("tu='TRUE' weekFrequency='1'") >= 0) { FREQ = 'WEEKLY' }
      if (rdata.indexOf("we='TRUE' weekFrequency='1'") >= 0) { FREQ = 'WEEKLY' }
      if (rdata.indexOf("th='TRUE' weekFrequency='1'") >= 0) { FREQ = 'WEEKLY' }
      if (rdata.indexOf("fr='TRUE' weekFrequency='1'") >= 0) { FREQ = 'WEEKLY' }
      if (rdata.indexOf('Every 1 day') >= 0) { FREQ = 'DAILY' }
      if (rdata.indexOf("mo='TRUE' tu='TRUE' we='TRUE' th='TRUE' fr='TRUE'") >= 0) { FREQ = 'DAILY' }
      if (rdata.indexOf('repeatForever') > 0 && FREQ == 'DAILY') { COUNT = 1350 } // just to ensure a good 5 year range for weekdays
      if (rdata.indexOf('repeatForever') > 0 && FREQ == 'WEEKLY') { COUNT = 275 } // just to ensure a good 5 year range
      if (rdata.indexOf("windowEnd") >= 0) {
        // this is more complex because it requires counting to the end date of the frequency to determine the COUNT value
        // so we need to get the windowEnd date and do math with it
      }
      RecurrenceRule = 'FREQ=' + FREQ + ';INTERVAL=1;COUNT=' + COUNT  // leaving intterval at 1 for now and only checking for daily or weekly events
      // console.log('1.8 RECURRENCE RULE: ' + RecurrenceRule)
    }
    // console.log('2 STARTYEAR: ' + startyear + ', ENDYEAR: ' + endyear)
    start = new Date(startyear, moment(start).month(), moment(start).date(), moment(start).hour(), moment(start).minute())
    end = new Date(endyear, moment(end).month(), moment(end).date(), moment(end).hour(), moment(end).minute())
    // console.log('3 START: ' + start + ', END: ' + end)
    if (allday === true || allday === 'true') {
      if (recurrence === true || recurrence === 'true') {
        p.push({
          id: j[i]["Id"],
          Id: j[i]["Id"],
          Subject: j[i]["Title"] !== null ? String(j[i]["Title"]) : "",
          Location: j[i]["Location"] !== null ? String(j[i]["Location"]) : "",
          StartTime: start,
          EndTime: end,
          class: c,
          isAllDay: true,
          Category: category,
          RecurrenceRule: RecurrenceRule,
          etag: j[i]["__metadata"]["etag"],
          uri: j[i]["__metadata"]["uri"]
        });
      } else {
        p.push({
          id: j[i]["Id"],
          Id: j[i]["Id"],
          Subject: j[i]["Title"] !== null ? String(j[i]["Title"]) : "",
          Location: j[i]["Location"] !== null ? String(j[i]["Location"]) : "",
          StartTime: start,
          EndTime: end,
          class: c,
          isAllDay: true,
          Category: category,
          etag: j[i]["__metadata"]["etag"],
          uri: j[i]["__metadata"]["uri"]
        });
      }
    } else {
      if (recurrence === true || recurrence === 'true') {
        p.push({
          id: j[i]["Id"],
          Id: j[i]["Id"],
          Subject: j[i]["Title"] !== null ? String(j[i]["Title"]) : "",
          Location: j[i]["Location"] !== null ? String(j[i]["Location"]) : "",
          StartTime: start,
          EndTime: end,
          class: c,
          Category: category,
          RecurrenceRule: RecurrenceRule,
          etag: j[i]["__metadata"]["etag"],
          uri: j[i]["__metadata"]["uri"]
        });
      } else {
        p.push({
          id: j[i]["Id"],
          Id: j[i]["Id"],
          Subject: j[i]["Title"] !== null ? String(j[i]["Title"]) : "",
          Location: j[i]["Location"] !== null ? String(j[i]["Location"]) : "",
          StartTime: start,
          EndTime: end,
          class: c,
          Category: category,
          etag: j[i]["__metadata"]["etag"],
          uri: j[i]["__metadata"]["uri"]
        });
      }
    }
  }
  return p
}

export default {
  getters,
  actions
}
