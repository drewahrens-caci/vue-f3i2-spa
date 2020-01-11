import { Model } from '@vuex-orm/core'
//import User from './User'

export default class Contractor extends Model {
  static entity = 'contractors'

  static fields() {
    return {
      spid: this.attr(null),
      id: this.attr(null),
      person_id: this.attr(null),
      code: this.string(''),
      ponumber: this.string(''),
      contractpoc: this.string(''), // does this need to be someone in the personnel model
      techpoc: this.string(''), // does this need to be someone in the personnel model
      employee: this.hasMany(Personnel, 'person_id')
    }
  }
}
