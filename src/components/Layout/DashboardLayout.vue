<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <NotificationContainer />
    <!-- <notifications></notifications> -->
    <side-bar>
      <user-menu></user-menu>
      <mobile-menu></mobile-menu>
      <template slot="links">
        <sidebar-item :link="{ name: 'Teams', library: 'fas', icon: 'users' }">
          <sidebar-item :link="{ name: 'Team 1', path: '/components/buttons' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Team 2', path: '/components/grid-system' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Team 3', path: '/components/panels' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Team 4', path: '/components/sweet-alert' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Travel', library: 'fas', icon: 'plane', path: '/travel/home' }">
          <sidebar-item :link="{ name: 'Travel Calendar', library: 'fas', icon: 'calendar', path: '/travel/home' }"></sidebar-item>
          <sidebar-item :link="{ name: 'New Travel Request', library: 'fas', icon: 'plane-departure', path: '/travel/new' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Travel Approval', library: 'far', icon: 'thumbs-up', path: '/travel/approval' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Update Travel', library: 'far', icon: 'edit', path: '/travel/update' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Processes', library: 'fas', icon: 'project-diagram' }">
          <sidebar-item :link="{ name: 'CDRL Management', path: '/forms/regular' }"></sidebar-item>
          <sidebar-item :link="{ name: 'CDRL Government Review', path: '/forms/extended' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Program Management', library: 'fas', icon: 'tasks' }">
          <sidebar-item :link="{ name: 'Regular Tables', path: '/table-list/regular' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Extended Tables', path: '/table-list/extended' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Paginated Tables', path: '/table-list/paginated' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Tools', library: 'fas', icon: 'tools' }">
          <sidebar-item :link="{ name: 'Google Maps', path: '/maps/google' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Full Screen Maps', path: '/maps/full-screen' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Vector Maps', path: '/maps/vector-map' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Team Calendar', library: 'far', icon: 'calendar-alt', path: '/pages/calendar' }"></sidebar-item>
        <sidebar-item :link="{ name: 'Pages', library: 'far', icon: 'file-alt' }">
          <sidebar-item :link="{ name: 'User Page', path: '/pages/user' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Login Page', path: '/login' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Register', path: '/register' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Lock Screen Page', path: '/lock' }"></sidebar-item>
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>
      <content-footer></content-footer>
    </div>
  </div>
</template>
<script>
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import MobileMenu from './MobileMenu.vue'
import UserMenu from './UserMenu.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
export default {
  components: {
    NotificationContainer,
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
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
<style lang="scss">
.vue-notifyjs.notifications {
  .list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active {
    transition: transform 0.2s ease-in, opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition: transform 1s ease-out, opacity 0.4s ease-out;
  }

  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(1.2, 0.7);
  }
}
</style>
