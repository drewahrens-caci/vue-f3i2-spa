import { Model } from '@vuex-orm/core'
//import User from './User'

export default class CDRL extends Model {
  static entity = 'cdrls'

  static fields() {
    return {
      id: this.number()
    }
  }
}
