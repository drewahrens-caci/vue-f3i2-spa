import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import * as support from '@/store/modules/support.js'
import * as travel from '@/store/modules/travel.js'
import * as notification from '@/store/modules/notification.js'
import User from '@/models/User'
import Todo from '@/models/Todo'
import Travel from '@/models/Travel'

Vue.use(Vuex)
const database = new VuexORM.Database()

// Register Models.
database.register(User)
database.register(Todo)
database.register(Travel)

Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    support,
    travel,
    notification
  },
  plugins: [VuexORM.install(database, { namespace: 'database' })]
})
