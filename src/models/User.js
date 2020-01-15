import { Model } from '@vuex-orm/core'
import Todo from './Todo'

export default class User extends Model {
  static entity = 'users'

  static state() {
    return {
      userid: null
    }
  }

  static fields() {
    return {
      id: this.attr(null),
      userid: this.attr(null),
      Account: this.attr(''),
      PictureUrl: this.attr(''),
      PersonalUrl: this.attr(''),
      Email: this.attr(''),
      EmailLink: this.attr(''),
      DisplayName: this.attr(''),
      Phone: this.attr(''),
      CellPhone: this.attr(''),
      Manager: this.attr(''),
      todos: this.hasMany(Todo, 'user_id', 'userid')
    }
  }
}
