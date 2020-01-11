import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Personnel extends Model {
  static entity = 'personnel'

  static fields() {
    return {
      id: this.attr(null),
      employee_id: this.attr(null),
      contractor_id: this.attr(null),
      techpoc: this.attr(null),
      percentsupport: this.number()
    }
  }
}
