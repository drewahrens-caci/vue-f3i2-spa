<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{ path: '/pages/home' }">Home</router-link>
          </li>
        </ul>
      </nav>
      <!-- <div class="copyright">
        &copy; Coded by Daniel Walker. Designed by CACI.
        <font-awesome-icon fas icon="heart" class="heart"></font-awesome-icon> by Daniel Walker. Designed by CACI.
      </div> -->
    </div>
  </footer>
</template>
<script>
export default {}
</script>
<style></style>
