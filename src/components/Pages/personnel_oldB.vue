<template>
  <b-container fluid class="contentHeight">
    <b-row ref="GridRow" class="contentHeight">
      <ejs-grid
        :enablePersistence="true"
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
        :sortSettings="sortSettings"
        :toolbar="toolbar"
        :allowExcelExport="true"
        :toolbarClick="toolbarClick"
        :dataBound="dataBound"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        :detailTemplate="detailTemplate"
        rowHeight="20"
        height="100%"
        width="100%"
      >
        <e-columns>
          <e-column field="LastName" headerText="Last" textAlign="Left" width="100" :showInColumnChooser="false"></e-column>
          <e-column field="FirstName" headerText="First" width="100" :showInColumnChooser="false"></e-column>
          <e-column field="Middle" headerText="Middle" textAlign="Left" width="100"></e-column>
          <e-column field="Cadency" headerText="Cadency" textAlign="Left" width="100"></e-column>
          <e-column field="Position" headerText="Position" textAlign="Left" width="180"></e-column>
          <e-column field="Location" headerText="Location" textAlign="Left" width="150"></e-column>
          <e-column field="Email" headerText="Email" textAlign="Left" width="300"></e-column>
          <e-column field="Phone" headerText="Phone" textAlign="Left" width="100"></e-column>
          <e-column field="Company" headerText="Company" textAlign="Left" width="250"></e-column>
          <e-column field="SubET" headerText="Sub ET" textAlign="Left" width="100"></e-column>
          <e-column field="CACStatus" headerText="CAC Status" textAlign="Left" width="110"></e-column>
          <e-column field="CACRequestDate" headerText="CAC Req Date" textAlign="Left" width="180"></e-column>
          <e-column field="CACExpirationDate" headerText="CAC Exp Date" textAlign="Left" width="180"></e-column>
          <e-column field="SCIFormStatus" headerText="SCI Form Status" textAlign="Left" width="150"></e-column>
          <e-column field="SCIFormType" headerText="SCI Form Type" textAlign="Left" width="150"></e-column>
          <e-column field="SCIFormSubmitted" headerText="SCI Form Submitted" textAlign="Left" width="150"></e-column>
          <e-column field="Contact" headerText="Contact" :visible="false" textAlign="Left" width="70" :showInColumnChooser="false"></e-column>
          <e-column field="Active" headerText="Active" :visible="false" textAlign="Left" width="70" :showInColumnChooser="false"></e-column>
          <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true" :showInColumnChooser="false"></e-column>
          <e-column field="WPData" headerText="WPData" :visible="false" textAlign="Left" width="40" :showInColumnChooser="false"></e-column>
        </e-columns>
      </ejs-grid>
    </b-row>
    <b-modal id="EditModal" ref="EditModal" size="xl" centered @ok="editOk">
      <template v-slot:modal-title>Edit Details For {{ rowData.FirstName + ' ' + rowData.LastName }}</template>
      <b-container fluid>
        <table id="EditTable" class="personneltable">
          <tbody>
            <tr class="bg-warning text-white">
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle</th>
              <th>Cadency (SR, JR, etc)</th>
              <th>Location</th>
              <th>Company</th>
            </tr>
            <tr class="bg-warning text-white">
              <td><input class="e-input" type="text" v-model="rowData.LastName" /></td>
              <td><input class="e-input" type="text" v-model="rowData.FirstName" /></td>
              <td><input class="e-input" type="text" v-model="rowData.Middle" /></td>
              <td><input class="e-input" type="text" v-model="rowData.Cadency" /></td>
              <td><input class="e-input" type="text" v-model="rowData.Location" /></td>
              <td><input class="e-input" type="text" v-model="rowData.Company" /></td>
            </tr>
            <tr class="bg-warning text-white">
              <th colspan="2">Position</th>
              <th colspan="2">Email</th>
              <th>Phone</th>
              <th>Sub ET</th>
            </tr>
            <tr class="bg-warning text-white">
              <td colspan="2"><input class="e-input" type="text" v-model="rowData.Position" /></td>
              <td colspan="2"><input class="e-input" type="text" v-model="rowData.Email" /></td>
              <td><input class="e-input" type="text" v-model="rowData.Phone" /></td>
              <td><ejs-dropdownlist v-model="rowData.SubET" :dataSource="subet" :fields="ddfields"></ejs-dropdownlist></td>
            </tr>
            <tr class="bg-warning text-white">
              <th colspan="2" title="CAC Status">CAC Status</th>
              <th colspan="2" title="CAC Request Date">CAC Req Date</th>
              <th colspan="2" title="CAC Expiration Date">CAC Exp Date</th>
            </tr>
            <tr class="bg-warning text-white">
              <td colspan="2"><ejs-dropdownlist v-model="rowData.CACStatus" :dataSource="cacstatus" :fields="ddfields"></ejs-dropdownlist></td>
              <td colspan="2"><ejs-datepicker v-model="rowData.CACRequestDate"></ejs-datepicker></td>
              <td colspan="2"><ejs-datepicker v-model="rowData.CACExpirationDate" :placeholder="waterMark"></ejs-datepicker></td>
            </tr>
            <tr class="bg-warning text-white">
              <th colspan="2" title="SCI Form Status">SCI Form Status</th>
              <th colspan="2" title="SCI Form Type">SCI Form Type</th>
              <th colspan="2" title="SCI Form Submitted">SCI Form Submiited</th>
            </tr>
            <tr class="bg-warning text-white">
              <td colspan="2"><ejs-dropdownlist v-model="rowData.SCIFormStatus" :dataSource="formstatus" :fields="ddfields"></ejs-dropdownlist></td>
              <td colspan="2"><ejs-dropdownlist v-model="rowData.SCIFormType" :dataSource="formtype" :fields="ddfields"></ejs-dropdownlist></td>
              <td colspan="2"><ejs-datepicker v-model="rowData.SCIFormSubmitted" :placeholder="waterMark"></ejs-datepicker></td>
            </tr>
            <tr class="bg-warning text-white text-center">
              <td colspan="6"><b>Work Plans</b></td>
            </tr>
            <tr>
              <td colspan="6">
                <b-table id="WPTable" ref="WPTable" v-model="WPData" :items="Plans" :fields="WPFields" style="table-layout: fixed;">
                  <template v-slot:cell(actions)="data">
                    <button size="sm" class="actionbutton" @click="deleteme(data.index)" title="Delete It">
                      <font-awesome-icon far icon="trash-alt" class="icon" :style="{ color: 'red' }"></font-awesome-icon>
                    </button>
                  </template>
                  <template v-slot:cell(Workplan)="data">
                    <ejs-dropdownlist v-model="WPData[data.index].Workplan" :dataSource="workplans" :fields="ddfields2" :id="getRef('Workplan', data.index)" @change="changewp"></ejs-dropdownlist>
                  </template>
                  <template v-slot:cell(PercentSupport)="data">
                    <ejs-dropdownlist v-model="WPData[data.index].PercentSupport" :dataSource="support" :fields="ddfields"></ejs-dropdownlist>
                  </template>
                </b-table>
                <button size="sm" @click="btnAddClick" variant="success">Add Work Plan</button>
              </td>
            </tr>
          </tbody>
        </table>
      </b-container>
    </b-modal>
    <b-modal id="NewModal" ref="NewModal" size="xl" centered @ok="newOk">
      <template v-slot:modal-title>Add New User</template>
      <div class="container-fluid">
        <table id="NewTable" class="personneltable">
          <tbody>
            <tr class="bg-warning text-white">
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle</th>
              <th>Company</th>
            </tr>
            <tr>
              <td><input class="e-input" type="text" v-model="newData.LastName" /></td>
              <td><input class="e-input" type="text" v-model="newData.FirstName" /></td>
              <td><input class="e-input" type="text" v-model="newData.Middle" /></td>
              <td><input class="e-input" type="text" v-model="newData.Company" /></td>
            </tr>
            <tr class="bg-warning text-white">
              <th colspan="2">Email</th>
              <th>Phone</th>
              <th>Sub ET</th>
            </tr>
            <tr>
              <td colspan="2"><input class="e-input" type="text" v-model="newData.Email" /></td>
              <td><input class="e-input" type="text" v-model="newData.Phone" /></td>
              <td><ejs-dropdownlist v-model="newData.SubET" :dataSource="subet" :fields="ddfields"></ejs-dropdownlist></td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import User from '@/models/User'
import Personnel from '@/models/Personnel'
import Workplan from '@/models/WorkPlan'
import { GridPlugin, Page, Sort, Filter, Edit, Reorder, Resize, ColumnChooser, ColumnMenu, ContextMenu, Toolbar, VirtualScroll, ExcelExport, DetailRow } from '@syncfusion/ej2-vue-grids'
import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars'
import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'
import { isNullOrUndefined } from 'util'

Vue.use(GridPlugin)
Vue.use(DatePickerPlugin)
Vue.use(DropDownListPlugin)

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
    },
    isWPManager() {
      return User.getters('isWPManager')
    }
  },
  data: function() {
    return {
      waterMark: 'Select a date',
      indexes: [],
      PersonnelId: 0,
      data: [],
      height: '100%',
      ddfields: { text: 'text', value: 'value' },
      ddfields2: { text: 'text', value: 'value', data: 'data' },
      yesno: [
        { text: 'Yes', value: 'Yes' },
        { text: 'No', value: 'No' }
      ],
      subet: [
        { text: 'N/A', value: 'N/A' },
        { text: 'Existing', value: 'Existing' },
        { text: 'Required', value: 'Required' }
      ],
      cacstatus: [
        { text: 'N/A', value: 'N/A' },
        { text: 'CACI Review', value: 'CACI Review' },
        { text: 'Requested', value: 'Requested' },
        { text: 'Pending Info', value: 'Pending Info' },
        { text: 'Returned', value: 'Returned' },
        { text: 'Renewed', value: 'Renewed' },
        { text: 'Issued', value: 'Issued' },
        { text: 'Disposition-Transferred', value: 'Disposition-Transferred' }
      ],
      formstatus: [
        { text: 'CACI Review', value: 'CACI Review' },
        { text: 'Not Required', value: 'Not Required' },
        { text: 'Pending Info', value: 'Pending Info' },
        { text: 'Submitted', value: 'Submitted' },
        { text: 'SSO Processed', value: 'SSO Processed' },
        { text: 'Disposition-TIS', value: 'Disposition-TIS' },
        { text: 'Disposition-Debriefed', value: 'Disposition-Debriefed' }
      ],
      formtype: [
        { text: 'N/A', value: 'N/A' },
        { text: 'Nomination', value: 'Nomination' },
        { text: 'Transfer', value: 'Transfer' }
      ],
      support: [
        { text: '100%', value: 1 },
        { text: '75%', value: 0.75 },
        { text: '50%', value: 0.5 },
        { text: '25%', value: 0.25 }
      ],
      WPFields: [
        { key: 'actions', label: 'Action', thClass: 'bg-warning text-white text-center px40' },
        { key: 'Workplan', label: 'Workplan', thClass: 'bg-warning text-white text-center px300' },
        { key: 'PercentSupport', label: 'Percent Support', thClass: 'bg-warning text-white text-center px200' }
      ],
      pageSettings: { pageSize: 30 },
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: false, mode: 'Dialog' },
      sortSettings: { columns: [{ field: 'LastName', direction: 'Ascending' }] },
      filterSettings: { type: 'Menu' },
      toolbar: ['Add', 'Edit', 'Print', 'Search', 'ExcelExport', 'ColumnChooser'],
      WPData: [
        {
          Workplan: '',
          WorkplanNumber: '',
          WorkplanTitle: '',
          PersonnelId: '0',
          PercentSupport: 1
        }
      ],
      Plans: [
        {
          Workplan: '',
          WorkplanNumber: '',
          WorkplanTitle: '',
          PersonnelId: '0',
          PercentSupport: 1
        }
      ],
      rowData: {},
      newData: {
        LastName: '',
        FirstName: '',
        Middle: '',
        Company: '',
        Email: ''
      },
      detailTemplate: function() {
        return {
          template: Vue.component('detailTemplate', {
            template: `
              <b-table-simple class="detailtable">
                <b-thead>
                  <b-tr>
                    <b-td>Work Plan</b-td>
                    <b-td>Percent Support</b-td>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr v-for="wp in pwps" :key="wp">
                    <b-td>{{wp.WorkplanTitle}}</b-td>
                    <b-td>{{wp.PercentSupport * 100}}</b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>`,
            data: function() {
              return {
                data: {}
              }
            },
            methods: {},
            computed: {
              pwps() {
                return JSON.parse(this.data.WPData)
              }
            }
          })
        }
      }
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
      // console.log('WAITING FOR PERSONNEL')
      if (this.personnel && this.personnel.length > 0) {
        clearInterval(this.$options.interval)
        // console.log('PERSONNEL LENGTH: ' + this.personnel.length)
        this.data = this.personnel
        switch (this.mode) {
          case 'onboarding':
            document.getElementById('PageTitle').innerHTML = ' -  Onboarding'
            this.$bvModal.show('NewModal')
            break

          case 'default':
            document.getElementById('PageTitle').innerHTML = ' -  Reports'
            break
        }
      }
    },
    getRef: function(text, idx) {
      return text + '_' + idx
    },
    toolbarClick: function(args) {
      switch (args.item.id) {
        case 'PersonnelGrid_excelexport':
          this.$refs['PersonnelGrid'].excelExport()
          break

        case 'PersonnelGrid_print':
          this.$refs['PersonnelGrid'].print()
          break
      }
    },
    onModalHide: function() {
      console.log('MODAL HIDE: ' + this.mode)
      vm.$router.push({ name: 'Refresh', params: { action: 'personnel' } })
    },
    actionBegin(args) {
      // console.log('ACTION BEGIN: ' + args.requestType)
      switch (args.requestType) {
        case 'beginEdit':
          // args.rowData contains the data for the row. Place this data in our edit form and we can change it and then update the row and also SharePoint
          args.cancel = true
          this.PersonnelId = args.rowData.Id
          this.editRow(args.rowData)
          break

        case 'add':
          args.cancel = true
          this.$bvModal.show('NewModal')
          break

        case 'filtering':
          // console.log('BEGIN FILTERING: ' + args)
          break
      }
    },
    actionComplete(args) {
      // console.log('ACTION COMPLETE: ' + args.requestType)
      if (args.requestType == 'columnstate') {
        this.$refs['PersonnelGrid'].autoFitColumns()
      }
      if (args.requestType == 'filtering') {
        // console.log('END FILTERING: ' + args)
      }
    },
    dataBound: function() {
      // this.$refs.PersonnelGrid.autoFitColumns(['LastName', 'FirstName', 'Position', 'Email', 'Location'])
      this.$refs.PersonnelGrid.autoFitColumns()
    },
    editRow: function(data) {
      console.log('TEST POINT DATA CHECK A: ' + data.WPData)
      if (data.WPData && data.WPData.length > 0) {
        this.Plans = JSON.parse(data.WPData)
      }
      this.$bvModal.show('EditModal')
      this.rowData = data
    },
    editOk: function() {
      console.log('LENGTH: ' + this.WPData[0].Workplan.length)
      if (this.WPData[0].Workplan.length > 3) {
        this.rowData.WPData = JSON.stringify(this.WPData)
      }
      Personnel.dispatch('editPerson', this.rowData).then(function() {
        vm.hideme('EditModal', 'refresh')
      })
    },
    newOk: function() {
      Personnel.dispatch('addPerson', this.newData).then(function() {
        vm.hideme('NewModal', 'refresh')
      })
    },
    btnAddClick: function() {
      this.Plans.push({
        Workplan: '',
        WorkplanNumber: '',
        WorkplanTitle: '',
        PersonnelId: '',
        PercentSupport: ''
      })
    },
    changewp: function(e) {
      var id = String(e.element.id)
      var index = id.split('_')[1]
      var tval = e.itemData.data
      tval = tval.split(', ')
      this.WPData[index].WorkplanNumber = tval[0]
      this.WPData[index].WorkplanTitle = tval[1]
      this.WPData[index].PersonnelId = this.PersonnelId
    },
    deleteme: function(index) {
      this.WPData.splice(index, 1)
      this.Plans.splice(index, 1)
    },
    hideme: function(modal, action) {
      vm.$bvModal.hide(modal)
      if (action == 'refresh') {
        vm.$router.push({ name: 'Refresh', params: { action: 'personnel' } })
      }
    }
  },
  provide: {
    grid: [Page, Sort, Filter, Edit, DetailRow, Reorder, Resize, ColumnChooser, ColumnMenu, ContextMenu, Toolbar, VirtualScroll, ExcelExport]
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.mode = to.params.mode
      switch (this.mode) {
        case 'onboarding':
          document.getElementById('PageTitle').innerHTML = ' -  Onboarding'
          this.$bvModal.show('NewModal')
          break

        case 'default':
          Personnel.dispatch('getPersonnel').then(function() {
            vm.$options.interval = setInterval(vm.waitForPeople, 1000)
          })
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
  width: 800px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#EditTable {
  font-size: 0.75rem !important;
}

.table td,
.table th {
  padding: 0.15rem !important;
}

input.e-input {
  height: 20px !important;
}

.e-input-group.e-control-wrapper .e-input-group-icon,
.e-input-group .e-input-group-icon {
  min-height: 20px !important;
}

.e-icon-grightarrow,
.e-icon-gdownarrow {
  color: black !important;
}
</style>
