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
      <div class="copyright">
        &copy; Coded with
        <font-awesome-icon fas icon="heart" class="heart"></font-awesome-icon> by <a href="#" target="_blank">Daniel Walker</a>. Designed by <a href="#" target="_blank" rel="noopener">CACI</a>.
      </div>
    </div>
  </footer>
</template>
<script>
export default {}
</script>
<style></style>
