import { Model } from '@vuex-orm/core'

export default class Travel extends Model {
  static entity = 'travel'

  static fields() {
    return {
      id: this.number(null),
      title: this.attr(''),
      start: this.attr(''),
      end: this.attr(''),
      classNames: this.attr('')
    }
  }
}
