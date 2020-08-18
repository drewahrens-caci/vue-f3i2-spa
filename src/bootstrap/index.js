import BootstrapVue from 'bootstrap-vue'
import Global from '../global'
import SideBar from '@/components/SidebarPlugin'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import { GanttPlugin } from '@syncfusion/ej2-vue-gantt'
import { GridPlugin } from '@syncfusion/ej2-vue-grids'
import { RichTextEditorPlugin } from '@syncfusion/ej2-vue-richtexteditor'
import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars'
import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'
import { CheckBoxPlugin } from '@syncfusion/ej2-vue-buttons'
import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'

import '../assets/css/themify-icons.css'
import '../assets/css/animate.css'
import '../assets/sass/bootstrap.scss'
import '../assets/css/spa.css'

export default {
  async install(Vue) {
    Vue.use(VueMoment, {
      moment
    })
    Vue.use(BootstrapVue)
    Vue.use(Global)
    Vue.use(SideBar)
    Vue.use(VueLodash, { lodash: lodash })
    Vue.use(UploaderPlugin)
    Vue.use(GanttPlugin)
    Vue.use(GridPlugin)
    Vue.use(RichTextEditorPlugin)
    Vue.use(DatePickerPlugin)
    Vue.use(DropDownListPlugin)
    Vue.use(CheckBoxPlugin)
  }
}
