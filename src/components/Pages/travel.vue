<template>
  <b-container fluid>
    <b-row>
      <b-col md="9" xs="12"><calendar :mode="mode"></calendar></b-col>
      <b-col md="3" xs="12"></b-col>
    </b-row>
  </b-container>
</template>

<script>
// import Calendar from '@/components/Calendar/Calendar.vue'
import Calendar from '@/components/Calendar/TravelCalendar.vue'
import { mapState } from 'vuex'

export default {
  name: 'home',
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
  components: {
    Calendar
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

<style lang="scss" scoped></style>
