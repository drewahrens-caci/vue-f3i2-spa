import { Model } from '@vuex-orm/core'
import User from './User'

export default class Todo extends Model {
  static entity = 'todos'

  static state() {
    return {
      loaded: false
    }
  }

  static fields() {
    return {
      id: this.attr(''),
      user_id: this.attr(null),
      Title: this.attr(''),
      Status: this.attr(''),
      StartDate: this.attr(''),
      DueDate: this.attr(''),
      Priority: this.attr('') /* ,
      user: this.belongsTo(User, 'user_id', 'userid') */
    }
  }
}
