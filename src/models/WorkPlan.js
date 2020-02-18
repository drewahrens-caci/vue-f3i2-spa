import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Workplan extends Model {
  static entity = 'workplan'

  static state() {
    return {
      digest: null,
      loaded: false,
      dropdown: []
    }
  }

  static fields() {
    return {
      id: this.attr(null),
      Id: this.attr(null),
      Title: this.attr(''),
      Number: this.attr(''),
      Revision: this.attr(''), // May not be needed
      Manager: this.attr('')
    }
  }
}
