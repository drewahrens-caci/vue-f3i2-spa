import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Feature extends Model {
  static entity = 'feature'

  static state() {
    return {
      digest: null,
      owners: [],
      loaded: false
    }
  }

  static fields() {
    return {
      id: this.attr(null), // internal id
      Id: this.attr(null), // SharePoint id
      Title: this.attr(''),
      Status: this.attr(''),
      Priority: this.attr(''),
      Effort: this.attr(''),
      Comment: this.attr(''),
      Category: this.attr(''),
      PercentComplete: this.attr(''),
      Rating: this.attr(''),
      RatingData: this.attr(''),
      UserRating: this.attr(''), // Used to track current user rating data is not saved here but used for calculations
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
