<template>
  <div id="wrapper">
    <div id="content">
      <theme-navbar></theme-navbar>
      <theme-content></theme-content>
    </div>
    <footer><theme-footer></theme-footer></footer>
  </div>
</template>
<script>
import ThemeNavbar from './NavBar.vue'
import ThemeFooter from './Footer.vue'
import ThemeContent from './ThemeContent.vue'
// import MobileMenu from './MobileMenu.vue'
export default {
  name: 'ThemeLayout',
  components: {
    ThemeNavbar,
    ThemeFooter,
    ThemeContent
  },
  methods: {}
}
</script>
<style lang="scss"></style>
