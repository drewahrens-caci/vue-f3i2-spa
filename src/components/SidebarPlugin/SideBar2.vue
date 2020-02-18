<template>
  <div class="sidebar" :style="sidebarStyle" :data-color="backgroundColor" :data-image="backgroundImage" :data-active-color="activeColor">
    <div class="sidebar-wrapper">
      <div class="logo">
        <a class="logo-mini" href="/sites/f3i2/Pages/Home.aspx">
          <div class="logo-img">
            <font-awesome-icon fas icon="fighter-jet" class="icon"></font-awesome-icon>
          </div>
        </a>
        <a href="" class="simple-text logo-normal">
          {{ title }}
        </a>
      </div>
      <slot> </slot>
      <ul class="nav">
        <slot name="links">
          <sidebar-item v-for="(link, index) in sidebarLinks" :key="link.name + index" :link="link">
            <sidebar-item v-for="(subLink, index) in link.children" :key="subLink.name + index" :link="subLink"> </sidebar-item>
          </sidebar-item>
        </slot>
      </ul>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
let vm = null
export default {
  name: 'sidebar',
  props: {
    title: {
      type: String,
      default: 'F3I-2'
    },
    backGround: {
      type: String,
      default: 'transparent'
    },
    backgroundColor: {
      type: String,
      default: 'black',
      validator: value => {
        let acceptedValues = ['', 'blue', 'azure', 'green', 'orange', 'red', 'purple', 'black']
        return acceptedValues.indexOf(value) !== -1
      }
    },
    backgroundImage: {
      type: String,
      default: '/sites/f3i2/SiteAssets/html/static/img/sidebar-3.jpg'
    },
    activeColor: {
      type: String,
      default: 'success',
      validator: value => {
        let acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
        return acceptedValues.indexOf(value) !== -1
      }
    },
    logo: {
      type: String,
      default: '/sites/f3i2/SiteAssets/html/static/img/vue-logo.png'
    },
    sidebarLinks: {
      type: Array,
      default: () => []
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    }
  },
  computed: {
    sidebarStyle() {
      return {
        // backgroundImage: `url(${this.backgroundImage})`
        backgroundColor: 'black',
        opacity: 0.7
      }
    }
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false
    }
  }
}
</script>
<style>
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}
</style>
