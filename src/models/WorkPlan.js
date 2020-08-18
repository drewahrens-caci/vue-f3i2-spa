import { Model } from '@vuex-orm/core'

export default class Workplan extends Model {
  static entity = 'workplan'

  static state() {
    return {
      digest: null,
      loaded: false,
      managers: [],
      dropdown: [],
      subs: null,
      subsloaded: false
    }
  }

  static fields() {
    return {
      id: this.attr(null),
      Id: this.attr(null),
      Title: this.attr(''),
      Number: this.attr(''),
      Revision: this.attr(''), // May not be needed
      POPStart: this.attr(''),
      POPEnd: this.attr(''),
      Manager: this.attr(''),
      ManagerId: this.attr(''),
      ManagerEmail: this.attr(''),
      DateApproved: this.attr(''),
      Subs: this.attr(''),
      LastIndex: this.attr(''),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
