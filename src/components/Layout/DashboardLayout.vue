<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <NotificationContainer />
    <side-bar>
      <user-menu></user-menu>
      <template slot="links">
        <sidebar-item :link="{ name: 'Travel', library: 'fas', icon: 'plane', path: '/travel/home' }">
          <sidebar-item :link="{ name: 'Travel Calendar', library: 'fas', icon: 'calendar', path: '/travel/home/refreshcalendar' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Travel Tracker', library: 'fas', icon: 'subway', path: '/travel/home/refreshtracker' }"></sidebar-item>
          <sidebar-item :link="{ name: 'New Travel Request', library: 'fas', icon: 'plane-departure', path: '/travel/home/new' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Personnel', library: 'fas', icon: 'users' }">
          <sidebar-item :link="{ name: 'Onboarding', library: 'fas', icon: 'user-check', path: '/personnel/home/new/onboarding' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Reports', library: 'fas', icon: 'id-card', path: '/personnel/home/reports/default' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Work Plans', library: 'fas', icon: 'briefcase' }">
          <sidebar-item :link="{ name: 'Active Work Plans', library: 'fas', icon: 'briefcase', path: '/workplans/home/active' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Manning Report', library: 'fas', icon: 'tasks', path: '/workplans/home/manning' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'PMO Calendar', library: 'far', icon: 'calendar-alt', path: '/calendar/home' }"></sidebar-item>
        <sidebar-item :link="{ name: 'Features and Bugs', library: 'far', icon: 'lightbulb' }">
          <sidebar-item :link="{ name: 'Report Bug or Request Feature', library: 'fas', icon: 'bug', path: '/feature/home' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Features', library: 'fas', icon: 'cubes', path: '/features/home' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Bugs', library: 'fas', icon: 'spider', path: '/bugs/home' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Monthly Status Reports', library: 'fas', icon: 'file-contract' }">
          <sidebar-item :link="{ name: 'Edit Reports', library: 'fas', icon: 'file-signature', path: '/msr/home' }"></sidebar-item>
          <sidebar-item v-if="!isSubcontractor" :link="{ name: 'Report Library', library: 'fas', icon: 'folder', path: '/msr/library' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-if="!isSubcontractor" :link="{ name: 'Financial', library: 'fas', icon: 'money-check-alt' }">
          <sidebar-item :link="{ name: 'Dashboard', library: 'fas', icon: 'file-invoice', path: '/financial/home' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Documents', library: 'fas', icon: 'book', path: '/financial/library' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item v-if="isAdmin" :link="{ name: 'Portal Administration', library: 'fas', icon: 'user-lock', path: '/admin/home/home' }"></sidebar-item>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar"></dashboard-content>
      <content-footer></content-footer>
    </div>
  </div>
</template>
<script>
import User from '@/models/User'
import UserMenu from './UserMenu.vue'
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
export default {
  computed: {
    isAdmin() {
      return User.getters('isAdmin')
    },
    isSubcontractor() {
      return User.getters('isSubcontractor')
    }
  },
  components: {
    NotificationContainer,
    TopNavbar,
    ContentFooter,
    DashboardContent,
    UserMenu
  },
  mounted: function() {
    // get the bounds of the content class which represents the main content area.
    let el = document.getElementById('maincontent')
    let rect = el.getBoundingClientRect()
    this.$store.dispatch('support/setContentRect', rect)
    this.$store.dispatch('support/addActivity', '<div class="bg-success text-white">DashboardLayout-MOUNTED: ' + rect.top + ', ' + rect.left + ', ' + rect.width + ', ' + rect.height + '</div>')
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false)
      }
    }
  }
}
</script>
<style lang="scss">
.main-panel {
  /*border: 2px solid red !important;*/
  background-color: black !important;
}
</style>
