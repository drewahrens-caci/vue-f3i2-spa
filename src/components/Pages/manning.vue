<template>
  <b-container fluid class="contentHeight">
    <b-row class="contentHeight">
      <b-container fluid class="contentHeight">
        <ejs-grid
          id="ManningGrid"
          ref="ManningGrid"
          :enablePersistence="false"
          :dataSource="WorkplanData"
          :allowPaging="true"
          :allowSorting="true"
          :allowFiltering="true"
          :allowReordering="true"
          :pageSettings="pageSettings"
          :editSettings="editSettings"
          :filterSettings="filterSettings"
          :toolbar="manningtoolbar"
          :allowExcelExport="true"
          :toolbarClick="manningtoolbarClick"
          rowHeight="20"
          height="100%"
          width="100%"
        >
          <e-columns>
            <e-column field="WorkplanTitle" headerText="Title" textAlign="Left" width="300"></e-column>
            <e-column field="WorkplanNumber" headerText="Number" width="100"></e-column>
            <e-column field="LastName" headerText="Last" textAlign="Left" width="100"></e-column>
            <e-column field="FirstName" headerText="First" width="100"></e-column>
            <e-column field="Middle" headerText="Middle" textAlign="Left" width="100"></e-column>
            <e-column field="Location" headerText="Location" textAlign="Left" width="150"></e-column>
            <e-column field="Email" headerText="Email" textAlign="Left" width="200"></e-column>
            <e-column field="Company" headerText="Company" textAlign="Left" width="180"></e-column>
            <e-column field="PercentSupport" headerText="Percent Support" textAlign="Left" width="150"></e-column>
          </e-columns>
        </ejs-grid>
      </b-container>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
// import moment from 'moment'
import { isNullOrUndefined } from 'util'
import Workplan from '@/models/WorkPlan'
import Personnel from '@/models/Personnel'
import { GridPlugin, Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, ContextMenu, DetailRow, Freeze, Toolbar, VirtualScroll, ExcelExport } from '@syncfusion/ej2-vue-grids'
// import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars'
// import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'

Vue.use(GridPlugin)
// Vue.use(DatePickerPlugin)
// Vue.use(DropDownListPlugin)

let vm = null

export default {
  name: 'manning',
  computed: {
    workplans() {
      return Workplan.getters('allWorkplans')
    },
    loaded() {
      return Workplan.getters('Loaded')
    },
    managers() {
      return Workplan.getters('Managers')
    },
    personnel() {
      return Personnel.getters('allPersonnel')
    }
  },
  data: function() {
    return {
      data: [],
      WorkplanData: [],
      manager: null,
      ddfields: { text: 'text', value: 'value', index: 'index' },
      pageSettings: { pageSize: 30 },
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: false, mode: 'Dialog' },
      filterSettings: { type: 'Menu' },
      manningtoolbar: ['Print', 'Search', 'ExcelExport']
    }
  },
  mounted: function() {
    vm = this
    Workplan.dispatch('getDigest')
    Personnel.dispatch('getPersonnel').then(function() {
      vm.$options.interval = setInterval(vm.waitForPlans, 1000)
    })
  },
  methods: {
    waitForPlans: function() {
      if (this.workplans && this.workplans.length > 0) {
        clearInterval(this.$options.interval)
        this.data = this.workplans
        for (let i = 0; i < this.personnel.length; i++) {
          let test = String(this.personnel[i]['WPData'])
          // console.log('WPDATA TEST POINT A: ' + test + ', ' + test.length)
          if (test.length > 5) {
            let j = JSON.parse(this.personnel[i]['WPData'])
            if (j && j.length > 0) {
              for (let z = 0; z < j.length; z++) {
                if (!isNullOrUndefined(j[z]['WorkplanNumber']) && String(j[z]['WorkplanNumber']).length > 4) {
                  this.WorkplanData.push({
                    WorkplanNumber: j[z]['WorkplanNumber'],
                    WorkplanTitle: j[z]['WorkplanTitle'],
                    LastName: this.personnel[i]['LastName'],
                    FirstName: this.personnel[i]['FirstName'],
                    Middle: this.personnel[i]['Middle'],
                    Location: this.personnel[i]['Location'],
                    Email: this.personnel[i]['Email'],
                    Company: this.personnel[i]['Company'],
                    PercentSupport: j[z]['PercentSupport'] * 100
                  })
                }
              }
            }
          }
        }
        document.getElementById('PageTitle').innerHTML = ' -  Manning Report'
      }
    },
    manningtoolbarClick: function(args) {
      switch (args.item.id) {
        case 'ManningGrid_excelexport':
          this.$refs['ManningGrid'].excelExport()
          break

        case 'ManningGrid_print':
          this.$refs['ManningGrid'].print()
          break
      }
    },
    dataBound: function() {
      this.$refs.WorkplanGrid.autoFitColumns()
    }
  },
  provide: {
    grid: [Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, ContextMenu, DetailRow, Freeze, Toolbar, VirtualScroll, ExcelExport]
  }
}
</script>

<style lang="scss"></style>
