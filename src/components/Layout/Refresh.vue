<template>
  <div>
    <!-- EMPTY -->
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Refresh',
  props: {
    action: String
  },
  mounted: function() {
    switch (this.action) {
      case 'travel':
        this.$router.push({ name: 'Travel Calendar', params: { mode: 'default' } })
        break

      /* case 'traveltracker':
        this.$router.push({ name: 'Travel Tracker', params: { mode: 'tracker' } })
        break */

      case 'traveltracker':
        this.$router.push({ name: 'Travel',  path: '/travel/home/tracker' })
        break

      case 'personnel':
        this.$router.push({ name: 'Reports', params: { mode: 'default' } })
        break

      case 'features':
        this.$router.push({ name: 'Features' })
        break

      case 'bugs':
        this.$router.push({ name: 'Bugs' })
        break
    }
  }
}
</script>
