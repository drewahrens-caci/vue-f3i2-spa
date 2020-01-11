import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import GlobalComponents from './globalComponents'
import VueFormWizard from 'vue-form-wizard'
import Notifications from 'vue-notifyjs'
import SideBar from '@/components/SidebarPlugin'
import ElementUI from 'element-ui'

// element ui language configuration
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

import 'bootstrap/dist/css/bootstrap.css'
import 'vue-notifyjs/themes/default.scss'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './assets/css/themify-icons.css'
import './assets/css/animate.css'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/sass/default.scss'
import './assets/css/spa.css'

Vue.use(BootstrapVue)
Vue.use(GlobalComponents)
Vue.use(VueFormWizard)
Vue.use(SideBar)
Vue.use(Notifications)
Vue.use(ElementUI, { locale })
