import { Model } from '@vuex-orm/core'
// import Todo from './Todo'

export default class User extends Model {
  static entity = 'users'

  static state() {
    return {
      userid: 0,
      usergroups: [],
      isOwner: false,
      isWPManager: false,
      isApprover: false
    }
  }

  static fields() {
    return {
      id: this.uid(),
      // userid: this.string(null),
      Account: this.attr(''),
      PictureUrl: this.attr(''),
      PersonalUrl: this.attr(''),
      Email: this.attr(''),
      EmailLink: this.attr(''),
      DisplayName: this.attr(''),
      Phone: this.attr(''),
      CellPhone: this.attr(''),
      Manager: this.attr(''),
      About: this.attr('')
      // todos: this.hasMany(Todo, 'user_id')
    }
  }
}
