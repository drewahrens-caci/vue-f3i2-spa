import { Model } from '@vuex-orm/core'

export default class MSR extends Model {
  static entity = 'msr'

  static state() {
    return {
      digest: null,
      loaded: false,
      locked: false,
      msrloaded: false,
      dropdown: [],
      count: 0,
      currentcount: 0,
      currentmsrs: [],
      currentmsr: {},
      currentyear: null,
      previousyear: null,
      currentmonth: null
    }
  }

  static fields() {
    return {
      id: this.attr(null), // internal id
      Id: this.attr(null), // SharePoint id
      WorkplanNumber: this.attr(''),
      WorkplanTitle: this.attr(''),
      PCAReview: this.attr(''),
      QAReview: this.attr(''),
      WPMReview: this.attr(''),
      Status: this.attr(''),
      Funding: this.attr(''),
      Staffing: this.attr(''),
      CostReport: this.attr(''),
      TravelAccomplished: this.attr(''),
      TravelPlanned: this.attr(''),
      TravelCosts: this.attr(''),
      ODCAccomplished: this.attr(''),
      ODCPlanned: this.attr(''),
      ODCCosts: this.attr(''),
      Accomplishments: this.attr(''),
      Plans: this.attr(''),
      Assumptions: this.attr(''),
      Risks: this.attr(''),
      Opportunities: this.attr(''),
      Deliverables: this.attr(''),
      Distribution: this.attr(''),
      Month: this.attr(''),
      Year: this.attr(''),
      Locked: this.attr(''),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
