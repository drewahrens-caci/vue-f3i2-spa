<template>
  <b-container fluid>
    <b-row>
      <ejs-grid
        id="PersonnelGrid"
        ref="PersonnelGrid"
        :dataSource="data"
        :allowPaging="true"
        :allowSorting="true"
        :allowFiltering="true"
        :allowReordering="true"
        :allowResizing="true"
        :showColumnChooser="true"
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
          <e-column field="LastName" headerText="Last" textAlign="Left" width="100" :showInColumnChooser="false"></e-column>
          <e-column field="FirstName" headerText="First" width="100" :showInColumnChooser="false"></e-column>
          <e-column field="Middle" headerText="Middle" textAlign="Left" width="100" :showInColumnChooser="false"></e-column>
          <e-column field="Cadency" headerText="Cadency" textAlign="Left" width="100"></e-column>
          <e-column field="Position" headerText="Position" textAlign="Left" width="180"></e-column>
          <e-column field="WorkPlan" headerText="Work Plan" textAlign="Left" width="120"></e-column>
          <e-column field="Location" headerText="Location" textAlign="Left" width="150"></e-column>
          <e-column field="Email" headerText="Email" textAlign="Left" width="300"></e-column>
          <e-column field="Company" headerText="Company" textAlign="Left" width="250"></e-column>
          <e-column field="CACRequestSubmitted" headerText="CAC Req Submtd" textAlign="Left" width="180"></e-column>
          <e-column field="CACRequestDate" headerText="CAC Req Date" textAlign="Left" width="180"></e-column>
          <e-column field="CACExpirationDate" headerText="CAC Exp Date" textAlign="Left" width="180"></e-column>
          <e-column field="EffectiveDate" headerText="Effective Date" textAlign="Left" width="150"></e-column>
          <e-column field="NominationForm" headerText="Nomination Form" textAlign="Left" width="150"></e-column>
          <e-column field="TransferForm" headerText="Transfer Form" textAlign="Left" width="150"></e-column>
          <e-column field="FormsSubmitted" headerText="Forms Submitted" textAlign="Left" width="150"></e-column>
          <e-column field="RequiredAccounts" headerText="Required Accounts" textAlign="Left" width="250"></e-column>
          <e-column field="SubmittedToAFRL" headerText="Submitted To AFRL" textAlign="Left" width="200"></e-column>
        </e-columns>
      </ejs-grid>
    </b-row>
    <b-modal id="EditModal" ref="EditModal" size="xl" centered @ok="editOk">
      <template v-slot:modal-title>Edit Details For {{ rowData.FirstName + ' ' + rowData.LastName }}</template>
      <b-container fluid>
        <table id="EditTable" class="personneltable">
          <tbody>
            <tr class="bg-black text-white">
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle</th>
              <th>Cadency</th>
              <th>Location</th>
              <th>Company</th>
            </tr>
            <tr class="bg-black text-white">
              <td><b-form-input v-model="rowData.LastName"></b-form-input></td>
              <td><b-form-input v-model="rowData.FirstName"></b-form-input></td>
              <td><b-form-input v-model="rowData.Middle"></b-form-input></td>
              <td><b-form-input v-model="rowData.Cadency"></b-form-input></td>
              <td><b-form-input v-model="rowData.Location"></b-form-input></td>
              <td><b-form-input v-model="rowData.Company"></b-form-input></td>
            </tr>
            <tr class="bg-black text-white">
              <th colspan="2">Work Plan</th>
              <th colspan="2">Position</th>
              <th colspan="2">Email</th>
            </tr>
            <tr class="bg-black text-white">
              <td colspan="2"><b-form-select v-model="rowData.WorkPlan" :options="workplans"></b-form-select></td>
              <td colspan="2"><b-form-input v-model="rowData.Position"></b-form-input></td>
              <td colspan="2"><b-form-input v-model="rowData.Email"></b-form-input></td>
            </tr>
            <tr class="bg-black text-white">
              <th title="CAC Request Date">CAC Req Date</th>
              <th title="CAC Expiration Date">CAC Exp Date</th>
              <th>Effective Date</th>
              <th>Nomination Form</th>
              <th>Transfer Form</th>
              <th>Forms Submiited</th>
            </tr>
            <tr class="bg-black text-white">
              <td><ejs-datepicker v-model="rowData.CACRequestDate"></ejs-datepicker></td>
              <td><ejs-datepicker v-model="rowData.CACExpirationDate"></ejs-datepicker></td>
              <td><ejs-datepicker v-model="rowData.EffectiveDate"></ejs-datepicker></td>
              <td><b-form-input v-model="rowData.NominationForm"></b-form-input></td>
              <td><b-form-input v-model="rowData.TransferForm"></b-form-input></td>
              <td><ejs-datepicker v-model="rowData.FormsSubmitted"></ejs-datepicker></td>
            </tr>
            <tr class="bg-black text-white">
              <th colspan="4">Required Accounts</th>
              <th colspan="2">Submitted To AFRL</th>
            </tr>
            <tr class="bg-black text-white">
              <td colspan="4"><b-form-input v-model="rowData.RequiredAccounts"></b-form-input></td>
              <td colspan="2"><ejs-datepicker v-model="rowData.SubmittedToAFRL"></ejs-datepicker></td>
            </tr>
          </tbody>
        </table>
      </b-container>
    </b-modal>
    <b-modal id="NewModal" ref="NewModal" size="xl" centered>
      <template v-slot:modal-title>Add New User</template>
      <b-container fluid>
        <b-form>
          <table id="NewTable" class="personneltable">
            <tbody>
              <tr class="bg-black text-white">
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle</th>
                <th>Company</th>
              </tr>
              <tr>
                <td><b-form-input v-model="newData.LastName"></b-form-input></td>
                <td><b-form-input v-model="newData.FirstName"></b-form-input></td>
                <td><b-form-input v-model="newData.Middle"></b-form-input></td>
                <td><b-form-input v-model="newData.Company"></b-form-input></td>
              </tr>
              <tr class="bg-black text-white">
                <th colspan="2">Work Plan</th>
                <th colspan="2">Email</th>
              </tr>
              <tr>
                <td colspan="2"><b-form-select v-model="newData.WorkPlan" :options="workplans"></b-form-select></td>
                <td colspan="2"><b-form-input v-model="newData.Email"></b-form-input></td>
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
import Personnel from '@/models/Personnel'
import Workplan from '@/models/WorkPlan'
// import { isNullOrUndefined } from 'util'
import { GridPlugin, Page, Sort, Filter, Edit, Reorder, Resize, ColumnChooser, ColumnMenu, ContextMenu, DetailRow, Freeze, Toolbar, VirtualScroll, ExcelExport } from '@syncfusion/ej2-vue-grids'
import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars'

Vue.use(GridPlugin)
Vue.use(DatePickerPlugin)

let vm = null

export default {
  name: 'personnel',
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    personnel() {
      return Personnel.getters('allPersonnel')
    },
    loaded() {
      return Personnel.getters('Loaded')
    },
    workplans() {
      return Workplan.getters('DropDown')
    }
  },
  data: function() {
    return {
      data: [],
      pageSettings: { pageSize: 30 }, // TODO: Perhaps calculate a dynamic size based on height?
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: false, mode: 'Dialog' },
      filterSettings: { type: 'Menu' },
      toolbar: ['Add', 'Edit', 'Print', 'Search', 'ExcelExport', 'ColumnChooser'],
      rowData: {},
      newData: {
        LastName: '',
        FirstName: '',
        Middle: '',
        Company: '',
        WorkPlan: '',
        Email: ''
      }
      /* detailTemplate: function() {
        return {
          template: Vue.component('detailTemplate', {
            template: `
              <table class="detailtable" width="100%">
                <thead>
                  <tr>
                    <td>CAC Request Date</td>
                    <td>CAC Request Submitted</td>
                    <td>CAC Expiration Date</td>
                    <td>Effective Date</td>
                    <td>Nomination Form</td>
                    <td>Transfer Form</td>
                    <td>Forms Submitted</td>
                    <td>Required Accounts</td>
                    <td>Submitted To AFRL</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{data.CACRequestDate}}</td>
                    <td>{{data.CACRequestSubmitted}}</td>
                    <td>{{data.CACExpirationDate}}</td>
                    <td>{{data.EffectiveDate}}</td>
                    <td>{{data.NominationForm}}</td>
                    <td>{{data.TransferForm}}</td>
                    <td>{{data.FormsSubmitted}}</td>
                    <td>{{data.RequiredAccounts}}</td>
                    <td>{{data.SubmittedToAFRL}}</td>
                  </tr>
                </tbody>
            </table>`,
            data: function() {
              return {
                data: {}
              }
            },
            methods: {},
            computed: {}
          })
        }
      } */
    }
  },
  mounted: function() {
    vm = this
    Personnel.dispatch('getDigest')
    Workplan.dispatch('getWorkplans').then(function() {
      Personnel.dispatch('getPersonnel').then(function() {
        vm.$options.interval = setInterval(vm.waitForPeople, 1000)
      })
    })
  },
  methods: {
    waitForPeople: function() {
      if (this.personnel && this.personnel.length > 0) {
        clearInterval(this.$options.interval)
        // console.log('PERSONNEL LENGTH: ' + this.personnel.length)
        this.data = this.personnel
        switch (this.mode) {
          case 'approval':
            var items = this.travel.filter(trip => trip.Status == 'New')
            for (let i = 0; i < items.length; i++) {
              let item = items[i]
              item.Travelers = JSON.parse(item.Travelers)
              this.approvalItems.push(item)
            }
            console.log('ITEMS TO APPROVE:' + items + ', ' + items.length)
            this.$bvModal.show('ApproveModal')
            break

          case 'onboarding':
            this.$bvModal.show('NewModal')
            break
        }
      }
    },
    toolbarClick: function(args) {
      // console.log('ARGS ID: ' + args.item.id)
      switch (args.item.id) {
        case 'PersonnelGrid_excelexport':
          this.$refs['PersonnelGrid'].excelExport()
          break

        case 'PersonnelGrid_print':
          this.$refs['PersonnelGrid'].print()
          break
      }
    },
    actionBegin(args) {
      // console.log('ACTION BEGIN: ' + args.requestType + ', args' + args)
      switch (args.requestType) {
        case 'beginEdit':
          // args.rowData contains the data for the row. Place this data in our edit form and we can change it and then update the row and also SharePoint
          args.cancel = true
          this.editRow(args.rowData)
          break

        case 'add':
          args.cancel = true
          this.$bvModal.show('NewModal')
          break
      }
    },
    actionComplete(args) {
      // console.log('ACTION COMPLETE: ' + args.requestType + ', args' + args)
      if (args.requestType == 'columnstate') {
        this.$refs['PersonnelGrid'].autoFitColumns()
      }
    },
    dataBound: function() {
      // this.$refs.PersonnelGrid.autoFitColumns(['LastName', 'FirstName', 'Position', 'Email', 'Location'])
      this.$refs.PersonnelGrid.autoFitColumns()
    },
    editRow: function(data) {
      this.rowData = data
      this.$bvModal.show('EditModal')
    },
    editOk: function() {
      // validate and save edit form
      Personnel.dispatch('editPerson', this.rowData).then(function() {
        // close the dialog
        this.$bvModal.hide('EditModal')
      })
    },
    newOk: function() {
      // validate and save new form
      Personnel.dispatch('addPerson', this.rowData).then(function() {
        // close the dialog
        this.$bvModal.hide('NewModal')
      })
    }
  },
  provide: {
    grid: [Page, Sort, Filter, Edit, Reorder, Resize, ColumnChooser, ColumnMenu, ContextMenu, DetailRow, Freeze, Toolbar, VirtualScroll, ExcelExport]
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.mode = to.params.mode
      // console.log('Mode changes from TravelCalendar.vue: ' + this.currentmode + ', ' + this.mode)
      switch (this.mode) {
        case 'onboarding':
          this.$bvModal.show('NewModal')
          break

        case 'default':
          window.location.reload()
          break
      }
    }
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
</style>
