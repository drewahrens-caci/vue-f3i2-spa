import { Model } from '@vuex-orm/core'

export default class Contact extends Model {
  static entity = 'contacts'

  static state() {
    return {
      loaded: false
    }
  }

  static fields() {
    return {
      id: this.uid(),
      Title: this.attr(''),
      Email: this.attr(''),
      EmailLink: this.attr(''),
      Phone: this.attr(''),
      Role: this.attr('')
    }
  }
}
