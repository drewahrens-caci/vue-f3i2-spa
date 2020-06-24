import { Model } from '@vuex-orm/core'

export default class Event extends Model {
  static entity = 'event'

  static state = {
    digest: null,
    events: [],
    event: {},
    loaded: false,
    loading: true,
    currentEvent: {}
  }

  static fields() {
    return {
      id: this.number(null), // id here is for module/model but must be same as Id from SharePoint
      Id: this.number(null), // this is the actual field from SharePoint
      isAllDay: this.attr(''),
      Subject: this.attr(''),
      Location: this.attr(''),
      StartTime: this.attr(''),
      EndTime: this.attr(''),
      class: this.attr(''),
      Category: this.attr(''),
      RecurrenceRule: this.attr(''),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
