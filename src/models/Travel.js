import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Travel extends Model {
  static entity = 'trips'

  static fields() {
    return {
      id: this.number()
    }
  }
}
