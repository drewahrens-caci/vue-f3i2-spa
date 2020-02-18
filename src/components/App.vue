<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  /* background-color: white !important; */
  background-image: url('/sites/f3i2/SiteAssets/html/static/img/background-1.JPG');
  background-size: cover;
  background-position: center center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000 !important;
}
</style>
