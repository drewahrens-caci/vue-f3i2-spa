import { Model } from '@vuex-orm/core'

export default class Travel extends Model {
  static entity = 'travel'

  static state = {
    digest: null,
    trips: [],
    trip: {},
    loaded: false,
    loading: true,
    sendEmail: false,
    createTask: false,
    currentEvent: {}
  }

  static fields() {
    return {
      id: this.number(null), // id here is for module/model but must be same as Id from SharePoint
      Id: this.number(null), // this is the actual field from SharePoint
      Subject: this.attr(''),
      Status: this.attr(''),
      StartTime: this.attr(''),
      EndTime: this.attr(''),
      class: this.attr(''),
      WorkPlan: this.attr(''),
      Company: this.attr(''),
      TravelFrom: this.attr(''),
      TravelTo: this.attr(''),
      Travelers: this.attr(''),
      Sponsor: this.attr(''),
      POCName: this.attr(''),
      POCEmail: this.attr(''),
      POCPhone: this.attr(''),
      Comments: this.attr(''),
      Clearance: this.attr(''),
      VisitRequest: this.boolean(false),
      EstimatedCost: this.attr(''),
      IndexNumber: this.attr('')
    }
  }
}
