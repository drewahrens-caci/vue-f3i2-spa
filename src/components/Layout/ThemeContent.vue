<template>
  <div class="content" id="contentbody">
    <div class="container-fluid">
      <NotificationContainer />
      <transition name="fade" mode="out-in">
        <!-- your content here -->
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import NotificationContainer from '@/components/NotificationContainer.vue'
export default {
  components: {
    NotificationContainer
  }
}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

 {
  opacity: 0;
}
</style>
