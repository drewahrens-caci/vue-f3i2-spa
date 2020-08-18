import Sidebar from './SideBar2.vue'
import SidebarItem from './SidebarItem.vue'
import LegendItem from './LegendItem.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [],
  isMinimized: false,
  displaySidebar(value) {
    this.showSidebar = value
  },
  toggleMinimize() {
    document.body.classList.toggle('sidebar-mini')
    this.isMinimized = !this.isMinimized
  }
}

const SidebarPlugin = {
  install(Vue, options) {
    if (options && options.sidebarLinks) {
      SidebarStore.sidebarLinks = options.sidebarLinks
    }
    Vue.mixin({
      data() {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get() {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
    Vue.component('sidebar-item', SidebarItem)
    Vue.component('legend-item', LegendItem)
  }
}

export default SidebarPlugin
