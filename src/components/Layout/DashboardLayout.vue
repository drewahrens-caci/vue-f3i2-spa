<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <NotificationContainer />
    <!-- <notifications></notifications> -->
    <side-bar>
      <user-menu></user-menu>
      <template slot="links">
        <sidebar-item :link="{ name: 'Travel', library: 'fas', icon: 'plane', path: '/travel/home' }">
          <sidebar-item :link="{ name: 'Travel Calendar', library: 'fas', icon: 'calendar', path: '/travel/home/default' }"></sidebar-item>
          <sidebar-item :link="{ name: 'New Travel Request', library: 'fas', icon: 'plane-departure', path: '/travel/home/new' }"></sidebar-item>
          <sidebar-item v-if="isApprover" :link="{ name: 'Travel Approval', library: 'far', icon: 'thumbs-up', path: '/travel/home/approval' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Update Travel', library: 'far', icon: 'edit', path: '/travel/home/update' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Personnel', library: 'fas', icon: 'users' }">
          <sidebar-item :link="{ name: 'Onboarding', library: 'fas', icon: 'user-check', path: '/personnel/home/onboarding' }"></sidebar-item>
          <sidebar-item :link="{ name: 'Reports', library: 'fas', icon: 'id-card', path: '/personnel/home/default' }"></sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{ name: 'Tools', library: 'fas', icon: 'tools' }">
          <sidebar-item v-if="isWPManager" :link="{ name: 'Work Plans', library: 'fas', icon: 'briefcase', path: '/workplans/home/default' }"></sidebar-item>
          <sidebar-item v-if="isOwner" :link="{ name: 'Backlog', library: 'fas', icon: 'tasks', path: '/backlog/home' }"></sidebar-item>
        </sidebar-item>
        <!-- <sidebar-item :link="{ name: 'Team Calendar', library: 'far', icon: 'calendar-alt', path: '/pages/calendar' }"></sidebar-item> -->
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
<style lang="scss">
/* .vue-notifyjs.notifications {
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
} */
</style>
