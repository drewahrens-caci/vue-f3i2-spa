import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import GlobalComponents from './globalComponents'
import VueFormWizard from 'vue-form-wizard'
import SideBar from '@/components/SidebarPlugin'
import ElementUI from 'element-ui'
import { GanttPlugin } from '@syncfusion/ej2-vue-gantt'

// element ui language configuration
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

import './assets/css/themify-icons.css'
import './assets/css/animate.css'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import './assets/sass/bootstrap.scss'
import './assets/css/spa.css'

Vue.use(BootstrapVue)
Vue.use(GlobalComponents)
Vue.use(VueFormWizard)
Vue.use(SideBar)
Vue.use(ElementUI, { locale })
Vue.use(GanttPlugin)
