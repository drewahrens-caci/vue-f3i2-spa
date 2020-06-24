import Vue from 'vue'
import bootstrap from './bootstrap'
import App from './components/App.vue'
import router from './router'
import store from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { dom } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(far, fas)
dom.watch()

Vue.component('font-awesome-icon', FontAwesomeIcon)
console.log('USING BOOTSTRAP')
Vue.use(bootstrap)
Vue.config.productionTip = false

Vue.config.devtools = true

/* function loadscript(url, callback) {
  let script = document.createElement('script')
  script.type = 'text/javascript'
  script.onload = function() {
    callback()
  }
  // eslint-disable-next-line no-undef
  let base = _spPageContextInfo.webServerRelativeUrl
  script.src = base + url
  document.documentElement.insertBefore(script, document.documentElement.firstChild)
} */

/* loadscript('/sites/f3i2/_layouts/15/autofill.js', function() {
  loadscript('/sites/f3i2/_layouts/15/clienttemplates.js', function() {
    loadscript('/sites/f3i2/_layouts/15/clientforms.js', function() {
      loadscript('/sites/f3i2/_layouts/15/clientpeoplepicker.js', function() {
        Vue.config.devtools = true

        new Vue({
          router,
          store,
          render: h => h(App)
        }).$mount('#app')
      })
    })
  })
}) */

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
