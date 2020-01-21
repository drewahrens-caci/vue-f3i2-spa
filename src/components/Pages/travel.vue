<template>
  <b-container fluid>
    <b-row>
      <b-col md="9" xs="12"><calendar :events="trips" title="Scheduled Travel" type="travel" :mode="mode"></calendar></b-col>
      <b-col md="3" xs="12"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import Calendar from '@/components/Calendar/Calendar.vue'
import { mapState } from 'vuex'

export default {
  name: 'home',
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
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
  },
  watch: {
    $route(to, from) {
      this.mode = to.params.mode
      console.log('Mode change from travel.vue: ' + this.mode)
    }
  }
}
</script>

<style lang="scss" scoped></style>
