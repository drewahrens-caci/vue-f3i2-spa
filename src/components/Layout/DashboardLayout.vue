<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <NotificationContainer />
    <side-bar>
      <user-menu></user-menu>
      <template slot="links">
        <sidebar-item :link="{ name: 'Travel', library: 'fas', icon: 'plane', path: '/travel/home' }">
          <sidebar-item :link="{ name: 'Travel Calendar', library: 'fas', icon: 'calendar', path: '/travel/home/calendar/default' }"></sidebar-item>
          <sidebar-item :link="{ name: 'New Travel Request', library: 'fas', icon: 'plane-departure', path: '/travel/home/new/new' }"></sidebar-item>
          <sidebar-item v-if="isTravelApprover" :link="{ name: 'Travel Approval', library: 'far', icon: 'thumbs-up', path: '/travel/home/approve/approval', badgeId: 'ApprovalCount' }"></sidebar-item>
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
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import UserMenu from './UserMenu.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
export default {
  computed: {
    isOwner() {
      return User.getters('isOwner')
    },
    isApprover() {
      return User.getters('isApprover')
    },
    isTravelApprover() {
      return User.getters('isTravelApprover')
    },
    isWPManager() {
      return User.getters('isWPManager')
    }
  },
  components: {
    NotificationContainer,
    TopNavbar,
    ContentFooter,
    DashboardContent,
    UserMenu
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

<style lang="scss"></style>
