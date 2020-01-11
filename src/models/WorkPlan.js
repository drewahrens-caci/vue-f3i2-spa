import { Model } from '@vuex-orm/core'
//import User from './User'

export default class WorkPlan extends Model {
  static entity = 'workplans'

  static fields() {
    return {
      id: this.attr(null),
      spid: this.number(),
      wpnumber: this.string(''),
      title: this.attr(null),
      travelindex: this.number(),
      pop: this.string(''),
      rev: this.number(),
      summary: this.string(''),
      location: this.string(''), // will be connected with locations
      features: this.string(''),
      assumptions: this.string(''),
      risks: this.string(''),
      security: this.string(''),
      schedule: this.string(''),
      cdrls: this.string('') // will be connected with CDRLS
    }
  }
}
