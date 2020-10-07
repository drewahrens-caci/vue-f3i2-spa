/* eslint-disable vue/valid-v-bind */
<template>
  <div class="sidebar" :style="sidebarStyle" :data-color="backgroundColor" :data-image="backgroundImage" :data-active-color="activeColor">
    <div class="sidebar-wrapper">
      <div class="logo">
        <a class="logo-mini" href="/sites/F3I2/Pages/Home.aspx">
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
      <ul class="legend" @click="setLegend" :class="{ 'legend-expanded': legendHeightExpanded }">
        <li class="legend-item">
          <b-alert variant="secondary" class="text-center" show>
            <span class="text-dark">LEGEND <b class="caret legend-caret" :class="{ 'legend-expanded-caret': legendHeightExpanded }"></b></span>
          </b-alert>
        </li>
        <div>
          <legend-item v-for="item in legendItems" :key="item.id" :item="item"></legend-item>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
// let vm = null
export default {
  name: 'sidebar',
  props: {
    title: {
      type: String,
      default: 'F3I2'
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
      default: '/sites/F3I2/DEV/SiteAssets/html/static/img/background-1.JPG'
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
      default: '/sites/F3I2/DEV/SiteAssets/html/static/img/vue-logo.png'
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
  data: function() {
    return {
      legendHeightExpanded: false // TODO: Save this state to localStorage and read from there.
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }
    },
    legendItems() {
      return this.$store.state.support.legendItems
    }
  },
  mounted: function() {
    this.getLegend()
  },
  methods: {
    getLegend: function() {
      let l = String(window.localStorage.getItem('legend'))
      if (l) {
        let legend = JSON.parse(l)
        if (legend) {
          this.legendHeightExpanded = legend.value
        }
      }
    },
    setLegend: function() {
      this.legendHeightExpanded = !this.legendHeightExpanded
      var legend = {
        value: this.legendHeightExpanded
      }
      window.localStorage.setItem('legend', JSON.stringify(legend))
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

.legend {
  display: block;
  position: absolute !important;
  bottom: 0;
  left: 0;
  background-color: black;
  opacity: 1;
  height: 2.5rem;
  overflow-y: auto;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.legend-expanded {
  height: 15rem !important;
}

.legend-item {
  height: 1.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.legend-caret {
  right: 1.5rem !important;
}

.legend-expanded-caret {
  transform: rotate(180deg);
}

.alert {
  padding: 0.25rem !important;
  margin: 0 !important;
}
</style>
