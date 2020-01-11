<template>
  <div class="sidebar" :style="sidebarStyle" :data-color="backgroundColor" :data-image="backgroundImage" :data-active-color="activeColor">
    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <div class="logo">
        <a class="logo-mini" href="https://infoplus.caci.com/sites/f3i2/Pages/Home.aspx">
          <div class="logo-img">
            <!-- <img :src="logo" alt="logo" /> -->
            <font-awesome-icon fas icon="home" class="icon"></font-awesome-icon>
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
import PerfectScrollbar from 'perfect-scrollbar'

export default {
  name: 'sidebar',
  props: {
    title: {
      type: String,
      default: 'F3I-2'
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
      default: '/sites/f3i2/SiteAssets/html/static/img/sidebar-2.jpg'
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
      default: 'static/img/vue-logo.png'
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
        backgroundImage: `url(${this.backgroundImage})`
        // backgroundColor: 'azure'
      }
    }
  },
  methods: {
    initScrollBar() {
      const PerfectScroll = new PerfectScrollbar(this.$refs.sidebarScrollArea, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20
      })
    }
  },
  mounted() {
    this.initScrollBar()
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
