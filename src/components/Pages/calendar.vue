<template>
  <b-container fluid class="contentHeight">
    <b-row class="contentHeight">
      <b-col md="10" xs="12"><calendar :mode="mode"></calendar></b-col>
      <b-col md="2" xs="12">
        <b-card id="Legend" title="Legend">
          <b-card-body class="p-0">
            <b-container fluid class="mx-0">
              <b-row class="checkpoints mb-1">Checkpoints</b-row>
              <b-row class="milestones mb-1">Miestones</b-row>
              <b-row class="predecessor mb-1">Predecessor Event</b-row>
              <b-row class="pto mb-1">PTO</b-row>
              <b-row class="recurring mb-1">Recurring Events</b-row>
              <b-row class="tdy mb-1">TDY</b-row>
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
    calendar: () => import(/* webpackChunkName: "pmocalendar" */ '../Calendar/PMOCalendar.vue')
  },
  mounted: function() {
    this.$nextTick(function() {
      const notification = {
        type: 'info',
        message: 'Getting Events, please wait'
      }
      this.$store.dispatch('notification/add', notification, { root: true })
    })
  }
}
</script>

<style lang="scss">
.checkpoints {
  background-color: #fff100 !important;
  color: black !important;
}
.milestones {
  background-color: #f07d88 !important;
  color: white !important;
}
.predecessor {
  background-color: #ff8c00 !important;
  color: white !important;
}
.pto {
  background-color: #474747 !important;
  color: white !important;
}
.recurring {
  background-color: #55abe5 !important;
  color: white !important;
}
.tdy {
  background-color: #ababab !important;
  color: black !important;
}
.edefault {
  background-color: #b3e5b8 !important;
  color: black !important;
}
</style>
