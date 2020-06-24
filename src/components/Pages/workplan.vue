<template>
  <b-container fluid class="contentHeight">
    <b-row v-if="mode == 'default'" class="contentHeight">
      <b-container fluid class="contentHeight">
        <ejs-grid
          id="WorkplanGrid"
          ref="WorkplanGrid"
          :enablePersistence="true"
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
          rowHeight="20"
          height="100%"
          width="100%"
        >
          <e-columns>
            <e-column headerText="Actions" textAlign="Left" width="100" :template="ActionsTemplate"></e-column>
            <e-column field="Title" headerText="Title" textAlign="Left" width="200"></e-column>
            <e-column field="Number" headerText="Number" width="100"></e-column>
            <e-column field="Revision" headerText="Revision" textAlign="Left" width="100"></e-column>
            <e-column field="POPStart" headerText="POP Start" textAlign="Left" width="150"></e-column>
            <e-column field="POPEnd" headerText="POP End" textAlign="Left" width="150"></e-column>
            <e-column field="Manager" headerText="Manager" textAlign="Left" width="200"></e-column>
            <e-column field="DateApproved" headerText="Date Approved" textAlign="Left" width="150"></e-column>
            <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true"></e-column>
            <e-column field="ManagerEmail" :visible="false" textAlign="Left" width="40"></e-column>
            <e-column field="uri" :visible="false" textAlign="Left" width="40"></e-column>
            <e-column field="etag" :visible="false" textAlign="Left" width="40"></e-column>
          </e-columns>
        </ejs-grid>
        <b-modal id="EditModal" ref="EditModal" size="xl" centered @ok="editOk">
          <template v-slot:modal-title>Edit Work Plan</template>
          <b-container fluid>
            <table id="EditTable" class="workplantable">
              <tbody>
                <tr class="bg-warning text-white">
                  <th>Title</th>
                  <th>Number</th>
                  <th>Revision</th>
                  <th>POP Start</th>
                  <th>POP End</th>
                  <th>Manager</th>
                  <th>Date Approved</th>
                </tr>
                <tr>
                  <td class="px300"><input class="e-input" type="text" v-model="rowData.Title" /></td>
                  <td><input class="e-input" type="text" v-model="rowData.Number" /></td>
                  <td><input class="e-input" type="text" v-model="rowData.Revision" /></td>
                  <td><ejs-datepicker v-model="rowData.POPStart"></ejs-datepicker></td>
                  <td><ejs-datepicker v-model="rowData.POPEnd"></ejs-datepicker></td>
                  <td><ejs-dropdownlist id="ddManagerEdit" v-model="rowData.Manager" :dataSource="managers" :fields="ddfields" @change="EditManagerSelected"></ejs-dropdownlist></td>
                  <td><ejs-datepicker v-model="rowData.DateApproved"></ejs-datepicker></td>
                </tr>
              </tbody>
            </table>
          </b-container>
        </b-modal>
        <b-modal id="NewModal" ref="NewModal" size="xl" centered @ok="newOk">
          <template v-slot:modal-title>Add New Work Plan</template>
          <b-container fluid>
            <table id="NewTable" class="workplantable">
              <tbody>
                <tr class="bg-warning text-white">
                  <th>Title</th>
                  <th>Number</th>
                  <th>Revision</th>
                  <th>POP Start</th>
                  <th>POP End</th>
                  <th>Manager</th>
                  <th>Date Approved</th>
                </tr>
                <tr>
                  <td class="px300"><input class="e-input" type="text" v-model="newData.Title" /></td>
                  <td><input class="e-input" type="text" v-model="newData.Number" /></td>
                  <td><input class="e-input" type="text" v-model="newData.Revision" /></td>
                  <td><ejs-datepicker v-model="newData.POPStart"></ejs-datepicker></td>
                  <td><ejs-datepicker v-model="newData.POPEnd"></ejs-datepicker></td>
                  <td><ejs-dropdownlist id="ddManagerNew" v-model="newData.Manager" :dataSource="managers" :fields="ddfields" @change="NewManagerSelected"></ejs-dropdownlist></td>
                  <td><ejs-datepicker v-model="rowData.DateApproved"></ejs-datepicker></td>
                </tr>
              </tbody>
            </table>
          </b-container>
        </b-modal>
      </b-container>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
import Workplan from '@/models/WorkPlan'
import Personnel from '@/models/Personnel'
import { GridPlugin, Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, ContextMenu, DetailRow, Freeze, Toolbar, VirtualScroll, ExcelExport } from '@syncfusion/ej2-vue-grids'
import { DatePickerPlugin } from '@syncfusion/ej2-vue-calendars'
import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'

Vue.use(GridPlugin)
Vue.use(DatePickerPlugin)
Vue.use(DropDownListPlugin)

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
      toolbar: ['Add', 'Edit', 'Update', 'Cancel', 'Print', 'Search', 'ExcelExport'],
      manningtoolbar: ['Print', 'Search', 'ExcelExport'],
      rowData: {},
      newData: {
        Title: '',
        Number: '',
        Revision: '',
        POPStart: '',
        POPEnd: '',
        Manager: '',
        DateApproved: ''
      },
      ManagerTemplate: function() {
        return {
          template: Vue.component('columnTemplate', {
            template: `
            <div>
              <span>
                <a :href="href">{{data.Manager}}</a>
              </span>
            </div>`,
            data: function() {
              return {
                data: {}
              }
            },
            computed: {
              href: function() {
                return 'mailto:' + this.data.ManagerEmail
              }
            }
          })
        }
      },
      ActionsTemplate: function() {
        return {
          template: Vue.component('columnTemplate', {
            template: `
            <div>
              <b-button class="actionbutton" @click="archiveme(data)" title="Archive">
                <font-awesome-icon far icon="times-circle" class="icon" :style="{ color: 'red' }"></font-awesome-icon>
              </b-button>
              <b-button :href="href" class="actionbutton ml-1" title="Email Workplan Manager">
                <font-awesome-icon far icon="envelope" class="icon" :style="{ color: 'green' }"></font-awesome-icon>
              </b-button>
            </div>`,
            data: function() {
              return {
                data: {}
              }
            },
            computed: {
              href: function() {
                return 'mailto:' + this.data.ManagerEmail
              }
            },
            methods: {
              archiveme: function(data) {
                this.$bvModal
                  .msgBoxConfirm('Archive This Work Plan?', {
                    title: 'Please Confirm',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: 'YES',
                    cancelTitle: 'NO',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                  })
                  .then(value => {
                    if (value == true) {
                      console.log('ARCHIVE ID: ' + data.Id)
                      let payload = {}
                      payload.etag = data.etag
                      payload.uri = data.uri
                      payload.id = data.Id
                      Workplan.dispatch('archive', payload).then(function() {
                        Workplan.dispatch('getWorkplans').then(function() {
                          vm.$options.interval = setInterval(vm.waitForPlans, 1000)
                        })
                      })
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            }
          })
        }
      }
    }
  },
  mounted: function() {
    vm = this
    Workplan.dispatch('getDigest')
    Personnel.dispatch('getPersonnel').then(function() {
      Workplan.dispatch('getManagers').then(function() {
        vm.$options.interval = setInterval(vm.waitForPlans, 1000)
      })
    })
  },
  methods: {
    waitForPlans: function() {
      if (this.workplans && this.workplans.length > 0) {
        clearInterval(this.$options.interval)
        this.data = this.workplans
        document.getElementById('PageTitle').innerHTML = ' -  Active Work Plans'
      }
    },
    toolbarClick: function(args) {
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
      switch (args.requestType) {
        case 'beginEdit':
          this.editRow(args.rowData)
          args.cancel = true
          break

        case 'add':
          args.cancel = true
          this.$bvModal.show('NewModal')
          break
      }
    },
    dataBound: function() {
      this.$refs.WorkplanGrid.autoFitColumns()
    },
    EditManagerSelected: function() {
      this.manager = document.getElementById('ddManagerEdit').ej2_instances[0].text
    },
    NewManagerSelected: function() {
      this.manager = document.getElementById('ddManagerNew').ej2_instances[0].text
    },
    editRow: function(data) {
      this.rowData = data
      this.$bvModal.show('EditModal')
    },
    editOk: function(bvEvent) {
      bvEvent.preventDefault()
      Workplan.dispatch('editWorkplan', this.rowData).then(function(response) {
        let j = response.data.d
        vm.rowData.etag = j['__metadata']['etag']
        vm.rowData.Manager = vm.manager
        vm.$refs.WorkplanGrid.setRowData(vm.rowData.Id, vm.rowData)
        vm.$bvModal.hide('EditModal')
        vm.$refs.WorkplanGrid.refresh()
      })
    },
    newOk: function() {
      Workplan.dispatch('addWorkplan', this.newData).then(function() {
        vm.$bvModal.hide('NewModal')
        Workplan.dispatch('getWorkplans').then(function() {
          vm.$options.interval = setInterval(vm.waitForPlans, 1000)
        })
      })
    }
  },
  provide: {
    grid: [Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, ContextMenu, DetailRow, Freeze, Toolbar, VirtualScroll, ExcelExport]
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.mode = to.params.mode
      switch (this.mode) {
        case 'manning':
          document.getElementById('PageTitle').innerHTML = ' -  Manning Report'
          break

        case 'default':
          document.getElementById('PageTitle').innerHTML = ' -  Active Work Plans'
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

#EditTable {
  font-size: 0.75rem !important;
}

#NewTable {
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
</style>
