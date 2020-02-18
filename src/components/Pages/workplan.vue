<template>
  <b-container fluid>
    <b-row>
      <ejs-grid
        id="WorkplanGrid"
        ref="WorkplanGrid"
        :dataSource="data"
        :allowPaging="true"
        :allowSorting="true"
        :allowFiltering="true"
        :allowReordering="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :filterSettings="filterSettings"
        :toolbar="toolbar"
        :allowExcelExport="true"
        :toolbarClick="toolbarClick"
        :dataBound="dataBound"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        rowHeight="20"
        width="100%"
      >
        <e-columns>
          <e-column field="Title" headerText="Title" textAlign="Left" width="200"></e-column>
          <e-column field="Number" headerText="Number" width="100"></e-column>
          <e-column field="Revision" headerText="Revision" textAlign="Left" width="100"></e-column>
          <e-column field="Manager" headerText="Manager" textAlign="Left" width="200"></e-column>
        </e-columns>
      </ejs-grid>
    </b-row>
    <b-modal id="EditModal" ref="EditModal" size="xl" centered>
      <template v-slot:modal-title>Edit Work Plan</template>
      <b-container fluid>
        <table id="EditTable" class="workplantable">
          <tbody>
            <tr class="bg-black text-white"></tr>
          </tbody>
        </table>
      </b-container>
    </b-modal>
    <b-modal id="NewModal" ref="NewModal" size="xl" centered>
      <template v-slot:modal-title>Add New Work Plan</template>
      <b-container fluid>
        <b-form>
          <table id="NewTable" class="workplantable">
            <tbody>
              <tr class="bg-black text-white">
                <th>Title</th>
                <th>Number</th>
                <th>Revision</th>
                <th>Manager</th>
              </tr>
              <tr>
                <td class="px300"><b-form-input v-model="newData.Title"></b-form-input></td>
                <td><b-form-input v-model="newData.Number"></b-form-input></td>
                <td><b-form-input v-model="newData.Revision"></b-form-input></td>
                <td><div id="managerpicker" class="peoplepicker"></div></td>
              </tr>
            </tbody>
          </table>
        </b-form>
      </b-container>
    </b-modal>
  </b-container>
</template>

<script>
import Vue from 'vue'
// import moment from 'moment'
import Workplan from '@/models/WorkPlan'
// import { isNullOrUndefined } from 'util'
import { GridPlugin, Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, ContextMenu, DetailRow, Freeze, Toolbar, VirtualScroll, ExcelExport } from '@syncfusion/ej2-vue-grids'

Vue.use(GridPlugin)

let vm = null

export default {
  name: 'workplan',
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    workplans() {
      return Workplan.getters('allWorkplans')
    },
    loaded() {
      return Workplan.getters('Loaded')
    }
  },
  data: function() {
    return {
      data: [],
      pageSettings: { pageSize: 30 }, // TODO: Perhaps calculate a dynamic size based on height?
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: false, mode: 'Dialog' },
      filterSettings: { type: 'Menu' },
      toolbar: ['Add', 'Edit', 'Update', 'Cancel', 'Print', 'Search', 'ExcelExport', 'ColumnChooser'],
      rowData: {},
      newData: {
        Title: '',
        Number: '',
        Revision: '',
        Manager: ''
      }
    }
  },
  mounted: function() {
    vm = this
    this.$root.$on('bv::modal::shown', () => { // bvEvent, modalId
      console.log('MODAL SHOWN')
      // vm.initializePeoplePicker('managerpicker')
    })
    Workplan.dispatch('getDigest')
    Workplan.dispatch('getWorkplans').then(function() {
      vm.$options.interval = setInterval(vm.waitForPlans, 1000)
    })
  },
  methods: {
    waitForPlans: function() {
      if (this.workplans && this.workplans.length > 0) {
        clearInterval(this.$options.interval)
        // console.log('PLANS LENGTH: ' + this.workplans.length)
        this.data = this.workplans
      }
    },
    toolbarClick: function(args) {
      // console.log('ARGS ID: ' + args.item.id)
      switch (args.item.id) {
        case 'WorkplanGrid_excelexport':
          this.$refs['WorkplanGrid'].excelExport()
          break

        case 'WorkplanGrid_print':
          this.$refs['WorkplanGrid'].print()
          break
      }
    },
    actionBegin(args) {
      // console.log('ACTION BEGIN: ' + args.requestType + ', args' + args)
      switch (args.requestType) {
        case 'beginEdit':
          // args.rowData contains the data for the row. Place this data in our edit form and we can change it and then update the row and also SharePoint
          this.editRow(args.rowData)
          args.cancel = true
          break

        case 'add':
          args.cancel = true
          this.$bvModal.show('NewModal')
          /* let pickers = document.getElementsByClassName('peoplepicker')
          for (let i = 0; i < pickers.length; i++) {
            console.log('PICKER ID: ' + pickers[i].id)
            this.initializePeoplePicker(pickers[i].id)
          } */
          /* this.$bvModal.show('NewModal') */
          break
      }
    },
    actionComplete() {
      // console.log('ACTION COMPLETE: ' + args.requestType + ', args' + args)
    },
    dataBound: function() {
      this.$refs.WorkplanGrid.autoFitColumns(['Title', 'Number', 'Revision'])
    },
    editRow: function(data) {
      this.rowData = data
      this.$bvModal.show('EditModal')
    }
    /* initializePeoplePicker: function(peoplePickerElementId) {
      console.log('CREATING PEOPLE PICKER')
      var schema = {}
      schema['PrincipalAccountType'] = 'User,SPGroup' // 'User,DL,SecGroup,SPGroup'
      schema['SearchPrincipalSource'] = 15
      schema['ResolvePrincipalSource'] = 15
      schema['AllowMultipleValues'] = true
      schema['MaximumEntitySuggestions'] = 50
      schema['Width'] = '280px'
      schema['SharePointGroupID'] = 47
      SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema)
    } */
  },
  provide: {
    grid: [Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, ContextMenu, DetailRow, Freeze, Toolbar, VirtualScroll, ExcelExport]
  }
}
</script>

<style lang="scss">
.detailtable td {
  font-size: 13px;
  padding: 4px;
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#managerpicker_TopSpan {
  width: 280px;
  padding: 5px 5px 6px 0px !important;
}
</style>
