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
    action: String,
    id: Number,
    msrdata: Object,
    dashboardtab: Number,
    fundingtab: Number,
    traveltab: Number,
    arotab: Number
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

      case 'msrhome':
        this.$router.push({ name: 'Home',  path: '/msr/home' })
        break

      case 'msrform':
        this.$router.push({ name: 'MSRForm', params: { id: this.id, msrdata: this.msrdata, dashboardtab: this.dashboardtab, fundingtab: this.fundingtab, traveltab: this.traveltab, arotab: this.arotab } })
        break

      case 'personnel':
        this.$router.push({ path: '/personnel/home/reports/default' })
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
