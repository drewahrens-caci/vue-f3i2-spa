import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import database from '@/database'
import * as support from '@/store/modules/support.js'
import * as travel from '@/store/modules/travel.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)
Vue.config.devtools = true

const store = new Vuex.Store({
  modules: {
    support,
    travel,
    notification
  },
  plugins: [VuexORM.install(database)]
})

export default store
