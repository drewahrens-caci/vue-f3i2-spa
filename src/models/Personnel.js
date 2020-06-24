import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Personnel extends Model {
  static entity = 'personnel'

  static state() {
    return {
      digest: null,
      loaded: false,
      dropdown: [],
      personnelwps: [],
      contacts: []
    }
  }

  static fields() {
    return {
      id: this.attr(null), // internal id
      Id: this.attr(null), // SharePoint id
      WPData: this.attr(''),
      Contact: this.attr(''),
      Active: this.attr(''),
      LastName: this.attr(''), // This is the Title column in SharePoint
      FirstName: this.attr(''),
      Middle: this.attr(''),
      Cadency: this.attr(''),
      Position: this.attr(''),
      Location: this.attr(''),
      Email: this.attr(''),
      Phone: this.attr(''),
      SubET: this.attr(''),
      Company: this.attr(''),
      CACStatus: this.attr(''),
      CACRequestDate: this.attr(''),
      CACExpirationDate: this.attr(''),
      SCIFormStatus: this.attr(''),
      SCIFormType: this.attr(''),
      SCIFormSubmitted: this.attr(''),
      PRDueDate: this.attr(''),
      CEDate: this.attr(''),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
