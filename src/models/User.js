import { Model } from '@vuex-orm/core'
// import Todo from './Todo'

export default class User extends Model {
  static entity = 'users'

  static state() {
    return {
      appversion: '1.0.02',
      loaded: false,
      userid: 0,
      usergroups: [],
      isPM: false,
      isSecurity: false,
      isDeveloper: false,
      isOwner: false,
      isWPManager: false,
      isApprover: false,
      isTravelApprover: false,
      isPCA: false,
      isMember: false,
      isSubcontractor: false,
      isAdmin: false
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
      FirstName: this.attr(''),
      LastName: this.attr(''),
      Phone: this.attr(''),
      CellPhone: this.attr(''),
      Manager: this.attr(''),
      About: this.attr(''),
      Company: this.attr(''),
      WPData: this.attr('')
      // todos: this.hasMany(Todo, 'user_id')
    }
  }
}
