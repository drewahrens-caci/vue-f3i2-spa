<template>
  <b-container fluid class="p-0 tabgantt">
    <b-row>
      <b-col cols="12">
        <div class="control-section">
          <div class="content-wrapper">
            <ejs-gantt
              ref="gantt"
              id="GanttContainer"
              :dataSource="chartdata"
              :dateFormat="dateFormat"
              :taskFields="taskFields"
              :editSettings="editSettings"
              :toolbar="toolbar"
              :allowSelection="true"
              :gridLines="gridLines"
              :height="height"
              :taskbarHeight="taskbarHeight"
              :rowHeight="rowHeight"
              :treeColumnIndex="1"
              :highlightWeekends="true"
              :timelineSettings="timelineSettings"
              :columns="columns"
              :eventMarkers="eventMarkers"
              :labelSettings="labelSettings"
              :editDialogFields="editDialogFields"
              :projectStartDate="projectStartDate"
              :projectEndDate="projectEndDate"
              :splitterSettings="splitterSettings"
              :taskbarEdited="onTaskbarEdited"
            >
            </ejs-gantt>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
let vm = null
// import Vue from 'vue'
import moment from 'moment'
import { isNullOrUndefined } from 'util'
import Backlog from '@/models/Backlog'
import { DataManager } from '@syncfusion/ej2-data'
import { Edit, Selection, Toolbar, DayMarkers } from '@syncfusion/ej2-vue-gantt'

// Vue.use(DataManager)

export default {
  data() {
    return {
      chartdata: [],
      dateFormat: 'MMM dd, y',
      taskFields: {
        id: 'id',
        name: 'name',
        startDate: 'start',
        endDate: 'end',
        progress: 'progress',
        parentID: 'parent',
        effort: 'effort',
        sprint: 'sprint',
        notes: 'notes'
        // resourceInfo: 'resources'
      },
      taskbarHeight: 20,
      rowHeight: 30,
      editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
      },
      toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
      gridLines: 'Both',
      height: '650px',
      timelineSettings: {
        topTier: {
          unit: 'Week',
          format: 'MMM dd, y'
        },
        bottomTier: {
          unit: 'Day'
        }
      },
      columns: [
        { field: 'id', headerText: 'ID', width: 50, isPrimaryKey: true },
        { field: 'name', headerText: 'Task', width: 250, clipMode: 'EllipsisWithTooltip' },
        { field: 'start', headerText: 'StartDate' },
        { field: 'end', headerText: 'Due Date' }
      ],
      eventMarkers: [
        { day: '12/16/2019', label: 'Project kick-off' },
        { day: '3/13/2019', label: 'MVP Complete' }
      ],
      labelSettings: {
        leftLabel: 'name'
      },
      editDialogFields: [{ type: 'General', headerText: 'General' }, { type: 'Notes' }],
      projectStartDate: new Date('12/01/2019'),
      projectEndDate: new Date('12/28/2021'), // calculated later
      splitterSettings: {
        columnIndex: 2
      }
    }
  },
  provide: {
    gantt: [Edit, Selection, Toolbar, DayMarkers]
  },
  computed: {
    todos() {
      return Backlog.getters('allItems')
    },
    loaded() {
      return Backlog.getters('Loaded')
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
        let lastdate = null
        let tasks = []
        for (let i = 0; i < p.length; i++) {
          let start = moment(p[i].StartDate).format('MM/DD/YYYY')
          let end = moment(p[i].DueDate).format('MM/DD/YYYY')
          if (i === 0) {
            lastdate = end
          } else {
            if (moment(end).isAfter(lastdate)) {
              lastdate = end
            }
          }
          tasks.push({
            name: p[i].Title,
            id: p[i].id,
            parent: '',
            start: start,
            end: end,
            notes: p[i].Body,
            effort: p[i].Effort,
            sprint: p[i].Sprint,
            ms: p[i].Milestone,
            progress: p[i].PercentComplete * 100
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
        lastdate = moment(lastdate)
          .add(2, 'months')
          .format('MM/DD/YYYY')
        this.projectEndDate = lastdate
        this.chartdata = new DataManager(tasks)
      }
    },
    onTaskbarEdited: function(evt) {
      console.log('Event edited: ' + evt)
    }
  },
  beforeDestroy() {
    clearInterval(this.$options.interval)
  }
}
</script>

<style></style>
