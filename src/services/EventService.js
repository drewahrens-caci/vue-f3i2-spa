import axios from 'axios'
import moment from 'moment'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let url = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('F3I2PMOShared')/items?$select=RecurrenceData,MasterSeriesItemID,EventType,*"
// let url = SPCI.webServerRelativeUrl + "/_api/lists/getbytitle('F3I2PMOShared')/items"
// let url = SPCI.webServerRelativeUrl + "/_api/web/lists/getbytitle('F3I2PMOShared')/GetItems"
let isostart = moment()
  .add(-6, 'M')
  .format()
let isoend = moment()
  .add(6, 'M')
  .format()
let caml = '<View><Query><CalendarDate>' + isostart + '</CalendarDate>'
caml += "<Where><Or><Or><Or><Or><And><And><DateRangesOverlap><FieldRef Name='EventDate' /><FieldRef Name='EndDate' /><FieldRef Name='RecurrenceID' />"
// caml += "<Value Type='DateTime'>" + isostart + "</Value></DateRangesOverlap><Eq><FieldRef Name='fRecurrence' /><Value Type='Text'>1</Value></Eq></And>"
caml += "<Value Type='DateTime'><Year /></Value></DateRangesOverlap><Eq><FieldRef Name='fRecurrence' /><Value Type='Text'>1</Value></Eq></And>"
caml += "<Leq><FieldRef Name='EventDate' /><Value Type='DateTime'>" + isoend + "</Value></Leq></And><And><And><Geq><FieldRef Name='EventDate' />"
caml += "<Value Type='DateTime'>" + isostart + "</Value></Geq><Leq><FieldRef Name='EndDate' /><Value Type='DateTime'>" + isoend + '</Value></Leq></And>'
caml += "<Eq><FieldRef Name='fRecurrence' /><Value Type='Text'>0</Value></Eq></And></Or><And><And><And><Geq><FieldRef Name='EventDate' />"
caml += "<Value Type='DateTime'>" + isostart + "</Value></Geq><Leq><FieldRef Name='EventDate' /><Value Type='DateTime'>" + isoend + '</Value></Leq></And><Gt>'
caml += "<FieldRef Name='EndDate' /><Value Type='DateTime'>" + isoend + "</Value></Gt></And><Eq><FieldRef Name='fRecurrence' /><Value Type='Text'>0</Value></Eq></And></Or>"
caml += "<And><And><And><Lt><FieldRef Name='EventDate' /><Value Type='DateTime'>" + isostart + "</Value></Lt><Leq><FieldRef Name='EndDate' /><Value Type='DateTime'>" + isoend + '</Value>'
caml += "</Leq></And><Gt><FieldRef Name='EndDate' /><Value Type='DateTime'>" + isostart + '</Value></Gt></And>'
caml += "<Eq><FieldRef Name='fRecurrence' /><Value Type='Text'>0</Value></Eq></And></Or>"
caml += "<And><And><Lt><FieldRef Name='EventDate' /><Value Type='DateTime'>" + isostart + "</Value></Lt><Gt><FieldRef Name='EndDate' /><Value Type='DateTime'>" + isoend + '</Value>'
caml += "</Gt></And><Eq><FieldRef Name='fRecurrence' /><Value Type='Text'>0</Value></Eq></And></Or></Where>"
// caml += "<QueryOptions><ExpandRecurrence>TRUE</ExpandRecurrence><RecurrencePatternXMLVersion>v3</RecurrencePatternXMLVersion><CalendarDate><Month /></CalendarDate><RecurrenceOrderBy>TRUE</RecurrenceOrderBy><ViewAttributes Scope='RecursiveAll' /></QueryOptions></Query></View>"
caml +=
  "<QueryOptions><IncludeMandatoryColumns>false</IncludeMandatoryColumns><ExpandRecurrence>true</ExpandRecurrence><RecurrencePatternXMLVersion>v3</RecurrencePatternXMLVersion><CalendarDate><Year /></CalendarDate><RecurrenceOrderBy>true</RecurrenceOrderBy><ViewAttributes Scope='RecursiveAll' /></QueryOptions></Query>"
caml +=
  "<ViewFields><FieldRef Name='Title' /><FieldRef Name='EventDate' /><FieldRef Name='Description' /><FieldRef Name='EndDate' /><FieldRef Name='Location' /><FieldRef Name='Author' /><FieldRef Name='EventType' /><FieldRef Name='Duration' /><FieldRef Name='Category' /><FieldRef Name='RecurrenceID' /><FieldRef Name='fRecurrence' /><FieldRef Name='RecurrenceData' /></ViewFields></View>"

let rdata = JSON.stringify({
  query: {
    __metadata: {
      type: 'SP.CamlQuery'
    },
    ViewXml: caml
  }
})

export default {
  getFormDigest() {
    return axios.request({
      url: SPCI.webServerRelativeUrl + '/_api/contextinfo',
      method: 'post',
      headers: { Accept: 'application/json; odata=verbose' }
    })
  },
  getEventsByCaml(dgst) {
    // console.log('EventService Passed Digest: ' + dgst)
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': dgst,
      'X-HTTP-Method': 'POST'
    }
    return axios.request({
      url: url,
      method: 'post',
      data: rdata,
      headers: headers
    })
  },
  getAllEvents() {
    let allEvents = []
    async function getAllTheEvents(eurl) {
      if (eurl === null) {
        eurl = url
      }

      let response = await axios.get(eurl, {
        headers: {
          accept: 'application/json;odata=verbose'
        }
      })
      let results = response.data.d.results
      allEvents = allEvents.concat(results)
      // recursively load people if there is a next result
      if (response.data.d.__next) {
        eurl = response.data.d.__next
        return getAllTheEvents(eurl)
      } else {
        return allEvents
      }
    }
    return getAllTheEvents(null)
  },
  async addEvent(payload, digest) {
    // payload is the full event object as json array with 1 element
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'POST'
    }
    let config = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: 'SP.Data.EventListItem' },
      Title: payload[0].Subject,
      EventDate: moment(payload[0].StartTime), // .format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      EndDate: moment(payload[0].EndTime), // .format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      Location: payload[0].Location,
      Categories: payload[0].Category
    }
    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      console.log('EventService Error Adding Event: ' + error)
    }
  },
  async editEvent(payload, digest) {
    // payload is the full event object as json array with 1 element
    let url = payload[0].uri
    let headers = {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      'X-RequestDigest': digest,
      'X-HTTP-Method': 'MERGE',
      'If-Match': payload[0].etag
    }
    let config = {
      headers: headers
    }
    let itemprops = {
      __metadata: { type: 'SP.Data.EventListItem' },
      Title: payload[0].Subject,
      EventDate: moment(payload[0].StartTime), // .format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      EndDate: moment(payload[0].EndTime), // .format('YYYY-MM-DD[T]HH:MM:[00Z]'), // adding 8 hours to remove the timezone offset
      Location: payload[0].Location,
      Categories: payload[0].Category
    }
    try {
      const response = await axios.post(url, itemprops, config)
      return response
    } catch (error) {
      console.log('EventService Error Editing Event: ' + error)
    }
  }
}
