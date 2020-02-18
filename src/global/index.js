import Card from '../components/Cards/Card.vue'
import { directive as vClickOutside } from 'vue-clickaway'

const GlobalComponents = {
  install (Vue) {
    Vue.component('card', Card)
    Vue.directive('click-outside', vClickOutside)
  }
}

export default GlobalComponents
