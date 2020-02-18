import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import * as support from '@/store/modules/support.js'
import * as notification from '@/store/modules/notification.js'
import User from '@/models/User'
import usermodule from '@/modules/usermodule'
/* import Todo from '@/models/Todo'
import todomodule from '@/modules/todomodule' */
import Backlog from '@/models/Backlog'
import backlogmodule from '@/modules/backlogmodule'
import Travel from '@/models/Travel'
import travelmodule from '@/modules/travelmodule'
import Personnel from '@/models/Personnel'
import personnelmodule from '@/modules/personnelmodule'
import WorkPlan from '@/models/WorkPlan'
import workplanmodule from '@/modules/workplanmodule'

Vue.use(Vuex)
const database = new VuexORM.Database()

// Register Models.
database.register(User, usermodule)
database.register(Backlog, backlogmodule)
database.register(Travel, travelmodule)
database.register(Personnel, personnelmodule)
database.register(WorkPlan, workplanmodule)

Vue.config.devtools = true

export default new Vuex.Store({
  modules: {
    support,
    notification
  },
  plugins: [VuexORM.install(database, { namespace: 'database' })]
})
