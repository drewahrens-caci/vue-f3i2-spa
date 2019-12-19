import Vue from 'vue'
import Vuex from 'vuex'
import * as travel from '@/store/modules/travel.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    travel,
    notification
  }
})
