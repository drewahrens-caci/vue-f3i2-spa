import Vue from 'vue'
import Vuex from 'vuex'
import * as support from '@/store/modules/support.js'
import * as travel from '@/store/modules/travel.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)
Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    support,
    travel,
    notification
  }
})
