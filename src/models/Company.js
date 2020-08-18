import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Company extends Model {
  static entity = 'company'

  static state() {
    return {
      digest: null,
      companies: [],
      dropdown: [],
      loaded: false
    }
  }

  static fields() {
    return {
      id: this.attr(null), // internal id
      Id: this.attr(null), // SharePoint id
      Title: this.attr(''),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
