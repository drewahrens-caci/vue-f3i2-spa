import BootstrapVue from 'bootstrap-vue'
import Global from '../global'
import SideBar from '@/components/SidebarPlugin'
import { GanttPlugin } from '@syncfusion/ej2-vue-gantt'

import '../assets/css/themify-icons.css'
import '../assets/css/animate.css'
import '../assets/sass/bootstrap.scss'
import '../assets/css/spa.css'

export default {
  async install(Vue) {
    Vue.use(BootstrapVue)
    Vue.use(Global)
    Vue.use(SideBar)
    Vue.use(GanttPlugin)
  }
}
