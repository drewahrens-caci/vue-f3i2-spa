import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import * as support from '@/store/modules/support.js'
// import * as travel from '@/store/modules/travel.js'
import * as notification from '@/store/modules/notification.js'
import User from '@/models/User'
import usermodule from '@/modules/usermodule'
import Todo from '@/models/Todo'
import todomodule from '@/modules/todomodule'
import Travel from '@/models/Travel'
import travelmodule from '@/modules/travelmodule'

Vue.use(Vuex)
const database = new VuexORM.Database()

// Register Models.
database.register(User, usermodule)
database.register(Todo, todomodule)
database.register(Travel, travelmodule)

Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    support,
    // travel,
    notification
  },
  plugins: [VuexORM.install(database, { namespace: 'database' })]
})
