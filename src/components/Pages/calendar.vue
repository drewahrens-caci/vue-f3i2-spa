<template>
  <b-container fluid>
    <b-row>
      <b-col xs="12"><calendar :events="events" title="Team Calendar" type="event"></calendar></b-col>
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
    eventsloaded() {
      return this.$store.state.events.loaded
    },
    eventsloading() {
      return this.$store.state.events.loading
    },
    events() {
      return this.$store.state.events.events
    },
    ...mapState(['events'])
  },
  components: {
    Calendar
  },
  data: function() {
    return {
      // calendarEvents: events
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      if (!this.eventsloaded) {
        const notification = {
          type: 'info',
          message: 'Getting Events, please wait'
        }
        this.$store.dispatch('notification/add', notification, { root: true })
        this.$store.dispatch('events/getEvents')
      }
    })
  }
}
</script>

<style lang="scss" scoped></style>
