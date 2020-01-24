<template>
  <b-container fluid class="p-0 tabgantt">
    <b-row>
      <b-col cols="12">
        <highcharts class="chart" :constructor-type="'ganttChart'" :options="chartOptions" ref="TodoGantt"></highcharts>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
let vm = null
import moment from 'moment'
import { isNullOrUndefined } from 'util'
import Todo from '@/models/Todo'
import Highcharts from 'highcharts'

var today = new Date(),
  day = 1000 * 60 * 60 * 24,
  // Utility functions
  dateFormat = Highcharts.dateFormat,
  defined = Highcharts.defined,
  isObject = Highcharts.isObject,
  reduce = Highcharts.reduce

// Set to 00:00:00:000 today
today.setUTCHours(0)
today.setUTCMinutes(0)
today.setUTCSeconds(0)
today.setUTCMilliseconds(0)
today = today.getTime()

export default {
  data() {
    return {
      chartOptions: {
        chart: {
          plotBackgroundColor: '#ffffff',
          plotBorderWidth: null,
          plotShadow: false,
          styledMode: true
          // width: 1700,
          // height: 600
        },
        series: [],
        scrollbar: {
          enabled: true
        },
        rangeSelector: {
          enabled: true,
          allButtonsEnabled: true,
          selected: 4
        },
        tooltip: {
          pointFormatter: function() {
            var point = this,
              format = '%e. %b',
              options = point.options,
              completed = options.completed,
              amount = isObject(completed) ? completed.amount : completed,
              status = (amount || 0) * 100 + '%',
              lines

            lines = [
              {
                value: point.name,
                style: 'font-weight: bold;'
              },
              {
                title: 'Start',
                value: dateFormat(format, point.start)
              },
              {
                visible: !options.milestone,
                title: 'End',
                value: dateFormat(format, point.end)
              },
              {
                title: 'Completed',
                value: status
              },
              {
                title: 'Owner',
                value: options.owner || 'unassigned'
              }
            ]
          }
        },
        title: {
          text: 'Project Management'
        },
        xAxis: {
          currentDateIndicator: true,
          min: today - 30 * day,
          max: today + 50 * day
        }
      }
    }
  },
  computed: {
    todos() {
      return Todo.getters('allTodos')
    },
    loaded() {
      return Todo.getters('Loaded')
    }
  },
  mounted: function() {
    vm = this
    this.$nextTick(function() {
      vm.$options.interval = setInterval(vm.setGanttData, 1000)
    })
  },
  methods: {
    setGanttData: function() {
      if (this.loaded) {
        clearInterval(this.$options.interval)
        console.log('All todos length: ' + vm.todos.length)
        // need to build the series data based on the todos
        let p = this.todos
        let series = {
          name: 'Milestones',
          data: []
        }
        let tasks = []
        for (let i = 0; i < p.length; i++) {
          let start = new Date(p[i].StartDate)
          let end = new Date(p[i].DueDate)
          start = Date.UTC(start.getFullYear(), start.getMonth() + 1, start.getDate())
          end = Date.UTC(end.getFullYear(), end.getMonth() + 1, end.getDate())
          tasks.push({
            name: p[i].Title,
            id: p[i].id,
            parent: '',
            start: start,
            end: end,
            ms: p[i].Milestone,
            completed: {
              amount: p[i].PercentComplete
            }
          })
        }
        // loop back through to setup milestones
        for (let i = 0; i < p.length; i++) {
          if (!isNullOrUndefined(p[i].Milestone)) {
            // This has a milestone so we need to go find it's id
            for (let j = 0; j < tasks.length; j++) {
              if (tasks[j].ms === p[i].Title) {
                tasks[j].parent = String(p[i].id)
              }
            }
          }
        }
        series.data = tasks
        this.chartOptions.series = series
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.$options.interval)
  }
}
</script>

<style></style>
