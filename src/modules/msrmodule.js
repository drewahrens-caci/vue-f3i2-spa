/* eslint-disable */
import Workplan from '@/models/WorkPlan'
import MSR from '@/models/MSR'
import MSRService from '@/services/MSRService.js'
import moment from 'moment'


let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
let m = moment().get('month')
let month = months[m]
let year = moment().year()
let prevyear = year - 1

const getters = {
  Loaded: state => {
    return state.loaded
  },
  MSRLoaded: state => {
    return state.msrloaded
  },
  MSR: state => {
    return state.currentmsr
  },
  allMSRs() {
    return MSR.all()
  },
  CurrentMSRs: state => {
    return state.currentmsrs
  },
  workplans() {
    return Workplan.getters('allWorkplans')
  },
}

const actions = {
  getDigest() {
    MSRService.getFormDigest()
      .then(response => {
        MSR.commit(state => {
          state.digest =
            response.data.d.GetContextWebInformation.FormDigestValue;
          state.currentmonth = month;
          state.currentyear = year;
          state.previousyear = prevyear;
        });
      })
      .catch(error => {
        console.log("There was an error getting digest data: ", error.response);
      });
  },
  async getMSR({ state }, payload) {
    let response = await MSRService.getMSR(payload);
    console.log("GetMSR Response: " + response);
    state.currentmsr = formatMSR(response);
    state.msrloaded = true;
  },
  async getMSRs({ state, commit }) {
    let response = await MSRService.getMSRs();
    MSR.create({ data: formatMSRs(response) });
    MSR.commit(state => {
      state.loaded = true;
    });
    state.currentmsrs = getCurrentMSRs(response);
  },
  async updateMSRData({ state }, payload) {
    state.msrloaded = false
    let response = await MSRService.updateMSRData(payload, state.digest)
    state.currentmsr = formatMSR(response)
    state.msrloaded = true
    return response
  },
  async publishMSR({ state }, payload) {
    let response = await MSRService.publishMSR(payload, state.digest)
    return response
  },
  async saveMSR({ state }, payload) {
    // Save the data for an MSR.
    let response = await MSRService.saveMSR(payload, state.digest)
    return response
  },
  async createMSR({ state }, payload) {
    // create an MSR.
    let response = await MSRService.createMSR(payload, state.digest)
    return response
  },
  async sendDistributionRequest({ state }, payload) {
    // send Distribution Request.
    let response = await MSRService.sendDistributionRequest(
      payload,
      state.digest
    );
    return response;
  },
  async getMSRDocument({ state }, uri) {
    let response = await MSRService.getMSRDocument(state, uri);
    return response;
  },
  async updateMSRDocument({ state }, payload) {
    let response = await MSRService.updateMSRDocument(payload, state.digest);
    return response;
  }
};

function formatMSR(j) {
  // should only be one MSR and is done when viewing an MSR
  let p = {}
  p.id= j['Id']
  p.Id= j['Id']
  p.WorkplanNumber= j['WorkplanNumber']
  p.WorkplanTitle= j['WorkplanTitle']
  p.Status = j['Status']
  p.PCAReview = j['PCAReview']
  p.QAReview = j['QAReview']
  p.WPMReview = j['WPMReview']
  p.Funding= j['Funding']
  p.Staffing= j['Staffing']
  p.CostReport = j['CostReport']
  p.TravelAccomplished= j['TravelAccomplished']
  p.TravelPlanned= j['TravelPlanned']
  p.TravelCosts = j['TravelCosts']
  p.ODCAccomplished= j['ODCAccomplished']
  p.ODCPlanned= j['ODCPlanned']
  p.ODCCosts= j['ODCCosts']
  p.Accomplishments= j['Accomplishments']
  p.Plans= j['Plans']
  p.Assumptions= j['Assumptions']
  p.Risks= j['Risks']
  p.Opportunities= j['Opportunities']
  p.Deliverables= j['Deliverables']
  p.Distribution= j['Distribution']
  p.Month= j['Month']
  p.Year= j['Year']
  p.Locked= j['Locked']
  p.etag= j['__metadata']['etag']
  p.uri= j['__metadata']['uri']
  return p
}

function getCurrentMSRs(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    if (j[i]['Month'] == month) {
      p.push({
        id: j[i]['Id'],
        Id: j[i]['Id'],
        WorkplanNumber: j[i]['WorkplanNumber'],
        WorkplanTitle: j[i]['WorkplanTitle'],
        PCAReview: j[i]['PCAReview'],
        QAReview: j[i]['QAReview'],
        WPMReview: j[i]['WPMReview'],
        Status: j[i]['Status'],
        Month: j[i]['Month'],
        Year: j[i]['Year'],
        Locked: j[i]['Locked'],
        etag: j[i]['__metadata']['etag'],
        uri: j[i]['__metadata']['uri']
      })
    }
  }
  return p
}

function formatMSRs(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      WorkplanNumber: j[i]['WorkplanNumber'],
      WorkplanTitle: j[i]['WorkplanTitle'],
      PCAReview: j[i]['PCAReview'],
      QAReview: j[i]['QAReview'],
      WPMReview: j[i]['WPMReview'],
      Status: j[i]['Status'],
      Month: j[i]['Month'],
      Year: j[i]['Year'],
      Locked: j[i]['Locked'],
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return p
}

export default {
  getters,
  actions
}
