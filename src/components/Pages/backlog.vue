<template>
  <b-container fluid>
    <b-row><backlog-gantt></backlog-gantt></b-row>
  </b-container>
</template>

<script>
import Backlog from '@/models/Backlog'
import BacklogGantt from '@/components/Charts/BacklogGantt.vue'

export default {
  name: 'backlog',
  components: {
    BacklogGantt
  },
  mounted: function() {
    this.$nextTick(function() {
      Backlog.dispatch('getItems')
    })
  }
}
</script>

<style lang="scss" scoped></style>
