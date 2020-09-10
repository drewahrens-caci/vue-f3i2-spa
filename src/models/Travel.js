import { Model } from '@vuex-orm/core'

export default class Travel extends Model {
  static entity = 'travel'

  static state = {
    digest: null,
    trips: [],
    afrltrips: [],
    trip: {},
    loaded: false,
    triploaded: false,
    loading: true,
    sendEmail: false,
    createTask: false,
    selectedtrip: {},
    currentEvent: {}
  }

  static fields() {
    return {
      id: this.number(null), // id here is for module/model but must be same as Id from SharePoint
      Id: this.number(null), // this is the actual field from SharePoint
      Subject: this.attr(''),
      Status: this.attr(''),
      OCONUS: this.attr(''),
      OCONUSLocation: this.attr(''),
      OCONUSApprovedBy: this.attr(''),
      OCONUSApprovedOn: this.attr(''),
      OCONUSApprovedEmail: this.attr(''),
      StartTime: this.attr(''),
      EndTime: this.attr(''),
      class: this.attr(''),
      WorkPlan: this.attr(''),
      WorkPlanText: this.attr(''),
      WorkPlanNumber: this.attr(''),
      OriginalWorkPlanNumber: this.attr(''),
      Company: this.attr(''),
      TravelFrom: this.attr(''),
      TravelTo: this.attr(''),
      Travelers: this.attr(''),
      TravelersText: this.attr(''),
      Sponsor: this.attr(''),
      POCName: this.attr(''),
      POCEmail: this.attr(''),
      POCPhone: this.attr(''),
      Comments: this.attr(''),
      Clearance: this.attr(''),
      VisitRequest: this.attr(''),
      SecurityAction: this.attr(''),
      SecurityActionCompleted: this.attr(''),
      PreApproved: this.attr(''),
      Approved: this.attr(''),
      EstimatedCost: this.attr(''),
      IndexNumber: this.attr(''),
      TripReport: this.attr(''),
      TripReportLink: this.attr(''),
      Created: this.attr(''),
      InternalData: this.attr(''),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
