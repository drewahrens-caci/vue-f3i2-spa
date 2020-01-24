<template>
  <b-container fluid>
    <b-row><todo-gantt></todo-gantt></b-row>
  </b-container>
</template>

<script>
import Todo from '@/models/Todo'
import TodoGantt from '@/components/Charts/TodoGanttSF.vue'

export default {
  name: 'todos',
  components: {
    TodoGantt
  },
  mounted: function() {
    this.$nextTick(function() {
      Todo.dispatch('getTodos')
    })
  }
}
</script>

<style lang="scss" scoped></style>
