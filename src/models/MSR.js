import { Model } from '@vuex-orm/core'

export default class MSR extends Model {
  static entity = 'msr'

  static state() {
    return {
      digest: null,
      loaded: false,
      dropdown: []
    }
  }

  static fields() {
    return {
      id: this.attr(null), // internal id
      Id: this.attr(null), // SharePoint id
      WorkplanNumber: this.attr(''),
      Company: this.attr(''),
      Section1: this.attr(''),
      Section2: this.attr(''),
      Section3: this.attr(''),
      Section4: this.attr(''),
      Section5: this.attr(''),
      Section6: this.attr(''),
      Section7: this.attr(''),
      Email: this.attr(''),
      Private: this.attr(''),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
