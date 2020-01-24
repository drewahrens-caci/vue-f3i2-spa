import { Model } from '@vuex-orm/core'
import User from './User'

export default class Todo extends Model {
  static entity = 'todos'

  static state() {
    return {
      digest: null,
      loaded: false,
      mytodosloaded: false,
      mytodos: [],
      tempid: null
    }
  }

  static fields() {
    return {
      id: this.uid(),
      user_id: this.string(null).nullable(),
      Title: this.attr(''),
      PercentComplete: this.attr(null),
      Body: this.attr(''),
      Status: this.attr(''),
      StartDate: this.attr(null),
      DueDate: this.attr(null),
      Priority: this.attr(null),
      assignee: this.belongsTo(User, 'user_id'),
      FirstName: this.attr(null),
      LastName: this.attr(null),
      EMail: this.attr(null),
      IsMilestone: this.boolean(false),
      Milestone: this.attr(null),
      etag: this.attr(null), // Used for updating
      uri: this.attr(null) // Used for updating
    }
  }
}
