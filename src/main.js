/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Bootstrap from './f3i2bootstrap'
import App from './components/App.vue'
import routes from './routes/routes'
import axios from 'axios'
import store from './store/index'

import { library } from '@fortawesome/fontawesome-svg-core'
import { dom } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(far, fas)
dom.watch()

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueRouter)
Vue.use(Bootstrap)
Vue.use(axios)
Vue.config.productionTip = false

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
