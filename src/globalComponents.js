/* eslint-disable */
import Card from './components/Cards/Card.vue'
import DropDown from './components/Dropdown.vue'
import { directive as vClickOutside } from 'vue-clickaway'

const GlobalComponents = {
  install (Vue) {
    Vue.component('card', Card)
    Vue.component('drop-down', DropDown)
    Vue.directive('click-outside', vClickOutside)
  }
}

export default GlobalComponents
