<template>
  <b-container fluid class="contentHeight">
    <b-row class="contentHeight">
      <b-col md="9" xs="12"><calendar :mode="mode"></calendar></b-col>
      <b-col md="3" xs="12">
        <b-card id="Legend" title="Legend">
          <b-card-body class="p-0">
            <b-container fluid class="mx-0">
              <b-row class="travel-new mb-1">New Travel</b-row>
              <b-row class="travel-approved mb-1">Travel Approved</b-row>
              <b-row class="travel-no-report mb-1">Requires Trip Report</b-row>
              <b-row class="travel-report mb-1">Completed Travel</b-row>
            </b-container>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'home',
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
  components: {
    // Calendar
    calendar: () => import(/* webpackChunkName: "travelcalendar" */ '../Calendar/TravelCalendar.vue')
  },
  mounted: function() {
    this.$nextTick(function() {
      const notification = {
        type: 'info',
        message: 'Getting Trips, please wait'
      }
      this.$store.dispatch('notification/add', notification, { root: true })
    })
  }
}
</script>

<style lang="scss"></style>
