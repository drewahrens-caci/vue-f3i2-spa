<template>
  <b-container fluid>
    <b-row>
      <b-col md="3" xs="12"></b-col>
      <b-col md="9" xs="12"><calendar :events="trips"></calendar></b-col>
    </b-row>
  </b-container>
</template>

<script>
import Calendar from '@/components/Calendar/Calendar.vue'
import { mapState } from 'vuex'
// import Contracts from '@/components/Contracts/Contracts.vue'
export default {
  name: 'home',
  computed: {
    tripsloaded() {
      return this.$store.state.travel.loaded
    },
    tripsloading() {
      return this.$store.state.travel.loading
    },
    trips() {
      return this.$store.state.travel.trips
    },
    ...mapState(['travel'])
  },
  components: {
    Calendar
  },
  data: function() {
    return {
      // calendarEvents: trips
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      if (!this.tripsloaded) {
        const notification = {
          type: 'info',
          message: 'Getting Trips, please wait'
        }
        this.$store.dispatch('notification/add', notification, { root: true })
        this.$store.dispatch('travel/getTRIPS')
      }
    })
  }
}
</script>

<style lang="scss" scoped></style>
