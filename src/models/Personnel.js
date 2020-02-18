import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Personnel extends Model {
  static entity = 'personnel'

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
      Active: this.boolean(),
      LastName: this.attr(''), // This is the Title column in SharePoint
      FirstName: this.attr(''),
      Middle: this.attr(''),
      Cadency: this.attr(''),
      Position: this.attr(''),
      WorkPlan: this.attr(''),
      Contact: this.boolean(false),
      Location: this.attr(''),
      Email: this.attr(''),
      Company: this.attr(''),
      CACRequestDate: this.attr(''),
      CACRequestSubmitted: this.attr(''),
      CACExpirationDate: this.attr(''),
      EffectiveDate: this.attr(''),
      NominationForm: this.attr(''),
      TransferForm: this.attr(''),
      FormsSubmitted: this.attr(''),
      RequiredAccounts: this.attr(''),
      Notes: this.attr(''),
      SubmittedToAFRL: this.attr(''),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
