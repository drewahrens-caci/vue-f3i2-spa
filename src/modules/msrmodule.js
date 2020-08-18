/* eslint-disable */
import Vue from 'vue'
import User from '@/models/User'
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
  Accomplishments: state => {
    return state.accomplishments
  },
  Plans: state => {
    return state.plans
  },
  Assumptions: state => {
    return state.assumptions
  },
  Risks: state => {
    return state.risks
  },
  Opportunities: state => {
    return state.opportunities
  },
  Deliverables: state => {
    return state.deliverables
  },
  workplans() {
    return Workplan.getters('allWorkplans')
  },
}

const actions = {
  getDigest() {
    MSRService.getFormDigest()
      .then(response => {
        MSR.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
          state.currentmonth = month
          state.currentyear = year
          state.previousyear = prevyear
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  async getMSR({ state }, payload) {
    let response = await MSRService.getMSR(payload)
    console.log('GetMSR Response: ' + response)
    state.currentmsr = formatMSR(response)
    state.msrloaded = true
  },
  async getMSRs({ state, commit }) {
    let response = await MSRService.getMSRs()
    MSR.create({ data: formatMSRs(response) })
    MSR.commit(state => {
      state.loaded = true
    })
    state.currentmsrs = getCurrentMSRs(response)
    // state.homemsrs = getHomeMSRs(response)
  },
  async updateMSRData({ state }, payload) {
    state.msrloaded = false
    let response = await MSRService.updateMSRData(payload, state.digest)
    state.currentmsr = formatMSR(response)
    state.msrloaded = true
  },
  async updateFunding({ state }, payload) {
    state.msrloaded = false
    let response = await MSRService.updateFunding(payload, state.digest)
    state.currentmsr = response
    state.msrloaded = true
  },
  async updateStaffing({ state }, payload) {
    state.msrloaded = false
    let response = await MSRService.updateStaffing(payload, state.digest)
    state.currentmsr = response
    state.msrloaded = true
  },
  async updateCostReport({ state }, payload) {
    state.msrloaded = false
    let response = await MSRService.updateCostReport(payload, state.digest)
    state.currentmsr = response
    state.msrloaded = true
  },
  async getAccomplishments({ state }, payload) {
    // Get Accomplishments.
    let response = await MSRService.getAccomplishments(payload)
    state.accomplishments = response
  },
  async updateAccomplishment({ state }, payload) {
    // Update Accomplishment.
    let response = await MSRService.updateAccomplishment(payload, state.digest)
    return response
  },
  async getPlans({ state }, payload) {
    // Get Plans.
    let response = await MSRService.getPlans(payload)
    state.plans = response
  },
  async updatePlan({ state }, payload) {
    // Update Plan.
    let response = await MSRService.updatePlan(payload, state.digest)
    return response
  },
  async getAssumptions({ state }, payload) {
    // Get Assumptions.
    let response = await MSRService.getAssumptions(payload)
    state.assumptions = response
  },
  async updateAssumption({ state }, payload) {
    // Update Assumptions.
    let response = await MSRService.updateAssumption(payload, state.digest)
    return response
  },
  async getRisks({ state }, payload) {
    // Get Risks.
    let response = await MSRService.getRisks(payload)
    state.risks = response
  },
  async updateRisk({ state }, payload) {
    // Update Risk.
    let response = await MSRService.updateRisk(payload, state.digest)
    return response
  },
  async getOpportunities({ state }, payload) {
    // Get Opportunities.
    let response = await MSRService.getOpportunities(payload)
    state.opportunities = response
  },
  async updateOpportunity({ state }, payload) {
    // Update Opportunity.
    let response = await MSRService.updateOpportunity(payload, state.digest)
    return response
  },
  async getDeliverables({ state }, payload) {
    // Get Deliverables.
    let response = await MSRService.getDeliverables(payload)
    state.deliverables = response
  },
  async updateDeliverable({ state }, payload) {
    // Update Deliverable.
    let response = await MSRService.updateDeliverable(payload, state.digest)
    return response
  },
  async saveMSR({ state }, payload) {
    // Save the data for an MSR.
    // payload contains the information that determines what is saved and where.
    let response = await MSRService.saveMSR(payload, state.digest)
    return response
  },
  async createMSR({ state }, payload) {
    // create an MSR.
    // payload contains the information that determines what is saved and where.
    let response = await MSRService.createMSR(payload, state.digest)
    return response
  },
  async sendDistributionRequest({ state }, payload) {
    // send Distribution Request.
    let response = await MSRService.sendDistributionRequest(payload, state.digest)
    return response
  },
}

function formatMSR(j) {
  // should only be one MSR and is done when viewing an MSR
  let p = {}
  p.id= j['Id']
  p.Id= j['Id']
  p.WorkplanNumber= j['WorkplanNumber']
  p.WorkplanTitle= j['WorkplanTitle']
  p.Status= j['Status']
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
  p.etag= j['__metadata']['etag']
  p.uri= j['__metadata']['uri']
  return p
}

function getCurrentMSRs(j) {
  // console.log('FORMATTING MSRs: ' + j)
  let p = []
  for (let i = 0; i < j.length; i++) {
    if (j[i]['Month'] == month) {
      p.push({
        id: j[i]['Id'],
        Id: j[i]['Id'],
        WorkplanNumber: j[i]['WorkplanNumber'],
        WorkplanTitle: j[i]['WorkplanTitle'],
        Status: j[i]['Status'],
        Month: j[i]['Month'],
        Year: j[i]['Year'],
        etag: j[i]['__metadata']['etag'],
        uri: j[i]['__metadata']['uri']
      })
    }
  }
  return p
}

function formatMSRs(j) {
  // console.log('FORMATTING MSRs: ' + j)
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      WorkplanNumber: j[i]['WorkplanNumber'],
      WorkplanTitle: j[i]['WorkplanTitle'],
      Status: j[i]['Status'],
      Month: j[i]['Month'],
      Year: j[i]['Year'],
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
