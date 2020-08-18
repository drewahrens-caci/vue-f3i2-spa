<template>
  <b-container fluid class="contentHeight">
    <b-row class="contentHeight">
      <b-toast id="busy-toast" variant="warning" solid no-auto-hide>
        <template v-slot:toast-title>
          <div class="d-flex flex-grow-1 align-items-baseline">
            <b-img blank blank-color="#ff0000" class="mr-2" width="12" height="12"></b-img>
            <strong class="mr-auto">{{ busyTitle }}</strong>
          </div>
        </template>
        <b-spinner style="width: 7rem; height: 7rem;" variant="success" label="Waiting Spinner"></b-spinner>
      </b-toast>
      <b-modal ref="FilterModal" id="FilterModal" size="sm" no-fade modal-class="animated bounceInLeft">
        <template v-slot:modal-title>Manning Filter</template>
        <div>
          <ul id="ulFields">
            <li v-for="field in fields" :key="field">
              <div v-if="field.FieldName !== 'Version'">
                <ejs-checkbox :label="field.DisplayName" :checked="field.Visible" @change="showorhide" :value="field.FieldName"></ejs-checkbox>
                <b-button size="sm" class="actionbutton float-right" :class="field.Filter ? null : 'collapsed'" :aria-expanded="field.Filter ? 'true' : 'false'" :aria-controls="getRef('collapse', field.FieldName)" @click="field.Filter = !field.Filter">
                  <font-awesome-icon fas icon="filter" class="icon"></font-awesome-icon>
                </b-button>
                <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'Down' ? 'sorted' : ''" :id="getRef('sortdown', field.FieldName)" @click="sortdown(field.FieldName, field.DataType)">
                  <font-awesome-icon fas icon="arrow-down" class="icon"></font-awesome-icon>
                </b-button>
                <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'Up' ? 'sorted' : ''" :id="getRef('sortup', field.FieldName)" @click="sortup(field.FieldName, field.DataType)">
                  <font-awesome-icon fas icon="arrow-up" class="icon"></font-awesome-icon>
                </b-button>
                <b-collapse class="mt-1" :id="getRef('collapse', field.FieldName)" v-model="field.Filter">
                  <b-container fluid>
                    <b-row class="mb-1">
                      <ejs-dropdownlist v-if="field.DataType == 'Text'" v-model="field.Predicate" :dataSource="textpredicate" :fields="ddfields"></ejs-dropdownlist>
                      <ejs-dropdownlist v-if="field.DataType == 'Number'" v-model="field.Predicate" :dataSource="numberpredicate" :fields="ddfields"></ejs-dropdownlist>
                      <ejs-dropdownlist v-if="field.DataType == 'Date'" v-model="field.Predicate" :dataSource="datepredicate" :fields="ddfields"></ejs-dropdownlist>
                    </b-row>
                    <b-row v-if="field.Control == 'DropdownBox'" class="mb-1">
                      <div v-if="field.DataType == 'Choice'" class="full">
                        <ejs-dropdownlist v-model="field.Selected" :dataSource="field.Options" :fields="ddfields"></ejs-dropdownlist>
                      </div>
                    </b-row>
                    <b-row v-if="field.Control != 'DropdownBox'" class="mb-1">
                      <b-form-input class="filterform" v-if="field.DataType == 'Text'" v-model="field.FilterValue"></b-form-input>
                      <b-form-input class="filterform" v-if="field.DataType == 'Number'" v-model="field.FilterValue"></b-form-input>
                      <ejs-datepicker v-if="field.DataType == 'Date'" v-model="field.FilterValue"></ejs-datepicker>
                    </b-row>
                    <b-row v-if="field.Predicate == 'B'" class="mb-1">
                      <ejs-datepicker v-if="field.DataType == 'Date'" v-model="field.FilterValue2"></ejs-datepicker>
                    </b-row>
                    <b-row>
                      <div class="full">
                        <b-button size="sm" variant="danger" :id="getRef('clear', field.FieldName)" class="float-right ml-1" @click="clearfilter">Clear</b-button>
                        <b-button size="sm" variant="success" :id="getRef('filter', field.FieldName)" class="float-right" @click="setfilter">Filter</b-button>
                      </div>
                    </b-row>
                  </b-container>
                </b-collapse>
              </div>
            </li>
            <li class="py30">
              <div class="full py30">
                <b-button size="sm" variant="danger" id="clearfilters" class="float-right ml-1" @click="clearfilters">Clear Filters</b-button>
                <b-button size="sm" variant="success" id="savefilters" class="float-right" @click="savefilters">Save Filters</b-button>
              </div>
            </li>
          </ul>
        </div>
      </b-modal>
      <b-col cols="12" class="m-0 p-0">
        <b-row class="contentHeight">
          <div class="col-12 py40">
            <b-button id="ShowFilters" class="btn btn-warning" @click="ToggleFilters">
              Toggle Filters
            </b-button>
          </div>
          <div class="col-12 tableHeight">
            <ejs-grid
              id="ManningGrid"
              ref="ManningGrid"
              :enablePersistence="false"
              :dataSource="filtereddata"
              :allowPaging="true"
              :allowReordering="true"
              :pageSettings="pageSettings"
              :editSettings="editSettings"
              :filterSettings="filterSettings"
              :toolbar="manningtoolbar"
              :allowExcelExport="true"
              :toolbarClick="manningtoolbarClick"
              :actionComplete="actionComplete"
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
          </div>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
import { isNullOrUndefined } from 'util'
import Company from '@/models/Company'
import User from '@/models/User'
import Workplan from '@/models/WorkPlan'
import Personnel from '@/models/Personnel'
import { Page, Edit, Toolbar, VirtualScroll, ExcelExport, DetailRow } from '@syncfusion/ej2-vue-grids'

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
    },
    appversion() {
      return User.getters('AppVersion')
    },
    user() {
      return User.getters('CurrentUser')
    },
    userid() {
      return User.getters('CurrentUserId')
    },
    companies() {
      return Company.getters('DropDown')
    }
  },
  data: function() {
    return {
      busyTitle: 'Getting Data. Please Wait.',
      sortfield: '',
      sortdir: '',
      data: [],
      WorkplanData: [],
      filtereddata: [],
      manager: null,
      fields: [
        {
          FieldName: 'Version',
          Value: null
        },
        {
          FieldName: 'WorkplanTitle',
          Visible: true,
          DisplayName: 'Title',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'WorkplanNumber',
          Visible: true,
          DisplayName: 'Number',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'LastName',
          Visible: true,
          DisplayName: 'Last',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'FirstName',
          Visible: true,
          DisplayName: 'First',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Middle',
          Visible: true,
          DisplayName: 'Middle',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Location',
          Visible: true,
          DisplayName: 'Location',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Email',
          Visible: true,
          DisplayName: 'Email',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Company',
          Visible: true,
          DisplayName: 'Company',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          DropdownSource: 'companies',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: []
        },
        {
          FieldName: 'PercentSupport',
          Visible: true,
          DisplayName: 'Percent Support',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: [
            { text: 'Select...', value: 'S' },
            { text: '100%', value: 1 },
            { text: '75%', value: 0.75 },
            { text: '50%', value: 0.5 },
            { text: '25%', value: 0.25 },
            { text: '0%', value: 0 }
          ]
        }
      ],
      ddfields: { text: 'text', value: 'value', index: 'index' },
      textpredicate: [
        { text: 'Select...', value: 'S' },
        { text: 'Starts With', value: 'SW' },
        { text: 'Ends With', value: 'EW' },
        { text: 'Contains', value: 'C' },
        { text: 'Equal', value: 'E' },
        { text: 'Not Equal', value: 'NE' }
      ],
      numberpredicate: [
        { text: 'Select...', value: 'S' },
        { text: 'Greater Than', value: 'GT' },
        { text: 'Less Than', value: 'LT' },
        { text: 'Equal', value: 'E' }
      ],
      pageSettings: { pageSize: 30 },
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: false, mode: 'Dialog' },
      filterSettings: { type: 'Menu' },
      manningtoolbar: ['Print', 'Search', 'ExcelExport']
    }
  },
  mounted: function() {
    vm = this
    this.$bvToast.show('busy-toast')
    Workplan.dispatch('getDigest')
    Company.dispatch('getCompanies').then(function() {
      Personnel.dispatch('getPersonnel').then(function() {
        vm.$options.interval = setInterval(vm.waitForPlans, 1000)
      })
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
        this.filtereddata = this.WorkplanData
        this.fields[8]['Options'] = this.companies
        document.getElementById('PageTitle').innerHTML = ' -  Manning Report'
        this.$bvToast.hide('busy-toast')
        // load any saved filters
        this.loadfilters()
      }
    },
    getRef: function(text, idx) {
      return text + '_' + idx
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
    actionComplete(args) {
      // console.log('ACTION COMPLETE: ' + args.requestType)
      if (args.requestType == 'columnstate') {
        this.$refs['ManningGrid'].autoFitColumns()
      }
      if (args.requestType == 'refresh') {
        let h1 = 0
        let h2 = this.$refs.ManningGrid.$el.children[7].children[0].clientHeight // children[7] matches .e-gridconent
        console.log('CLIENTHEIGHT: ' + h2)
        h1 = Math.floor(h2 / 20)
        this.pageSettings.pageSize = h1
        this.$refs.ManningGrid.pageSettings = { pageSize: h1 }
      }
    },
    dataBound: function() {
      this.$refs.ManningGrid.autoFitColumns()
    },
    /* -------------------------------------------------------------------------------------------------- FILTER Functions --------------------------------------------------------------------- */
    ToggleFilters() {
      this.$refs['FilterModal'].toggle('#ShowFilters')
    },
    sortup: function(e, t) {
      // ascending
      var p = this.filtereddata
      if (t == 'Date') {
        p = Vue._.orderBy(
          p,
          function(o) {
            return new moment(o[e]).format('YYYYMMDD')
          },
          'asc'
        )
      } else {
        p = Vue._.orderBy(p, e, 'asc')
      }
      this.filtereddata = p
      this.$refs.ManningGrid.refresh()
      for (var i = 0; i < this.fields.length; i++) {
        if (this.fields[i].FieldName == e) {
          console.log('SORT UP: ' + e)
          this.fields[i].Sort = 'Up'
        } else {
          this.fields[i].Sort = ''
        }
      }
    },
    sortdown: function(e, t) {
      // descending
      var p = this.filtereddata
      if (t == 'Date') {
        p = Vue._.orderBy(
          p,
          function(o) {
            return new moment(o[e]).format('YYYYMMDD')
          },
          'desc'
        )
      } else {
        p = Vue._.orderBy(p, e, 'desc')
      }
      this.filtereddata = p
      this.$refs.ManningGrid.refresh()
      for (var i = 0; i < this.fields.length; i++) {
        if (this.fields[i].FieldName == e) {
          // console.log('SORT DOWN: ' + e)
          this.fields[i].Sort = 'Down'
        } else {
          this.fields[i].Sort = ''
        }
      }
    },
    showorhide: function(e) {
      // console.log('SHOW OR HIDE: ' + e)
      var checked = e.checked
      // var fieldname = e.event.target.value
      var displayname = e.event.target.labels[0].innerText
      if (checked) {
        this.$refs.ManningGrid.showColumns([displayname])
        this.$refs.ManningGrid.autoFitColumns()
      } else {
        this.$refs.ManningGrid.hideColumns([displayname])
        this.$refs.ManningGrid.autoFitColumns()
      }
    },
    setfilter: function() {
      // always reset to all records then do all filters as they are selected.
      // this is a top down filter
      // loop through all the fields and filter the ones that have a predicate and filtervalue set
      var p = this.WorkplanData // set initial filter to all based on the module.
      for (var i = 1; i < vm.fields.length; i++) {
        if (vm.fields[i].Predicate !== 'S') {
          if (vm.fields[i].FilterValue !== '' || vm.fields[i].Selected !== 'S') {
            // determine what to filter based on predicate
            switch (vm.fields[i].Predicate) {
              case 'SW':
                // Starts With
                p = p.filter(search => Vue._.startsWith(search[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                break

              case 'EW':
                // Ends With
                p = p.filter(search => Vue._.endsWith(search[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                break

              case 'C':
                // Contains
                p = p.filter(search => Vue._.includes(search[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                break

              case 'E':
                // Equals
                if (vm.fields[i].DataType == 'Choice') {
                  p = p.filter(search => Vue._.isEqual(search[vm.fields[i].FieldName], vm.fields[i].Selected))
                } else {
                  if (vm.fields[i].DataType == 'Number') {
                    p = p.filter(search => search[vm.fields[i].FieldName] == vm.fields[i].FilterValue)
                  } else {
                    p = p.filter(search => Vue._.isEqual(search[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                  }
                }
                break

              case 'NE':
                // Not Equals
                p = p.filter(search => Vue._.without(search[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                break

              case 'GT':
                // Greater Than
                if (vm.fields[i].DataType == 'Number') {
                  p = p.filter(search => search[vm.fields[i].FieldName] > vm.fields[i].FilterValue)
                } else {
                  // date
                  p = p.filter(search => moment(search[vm.fields[i].FieldName]).isAfter(moment(vm.fields[i].FilterValue)))
                }
                break

              case 'LT':
                // Less Than
                if (vm.fields[i].DataType == 'Number') {
                  p = p.filter(search => search[vm.fields[i].FieldName] < vm.fields[i].FilterValue)
                } else {
                  // date
                  p = p.filter(search => moment(vm.fields[i].FilterValue).isAfter(moment(search[vm.fields[i].FieldName])))
                }
                break

              case 'B':
                // Between
                p = p.filter(search => moment(search[vm.fields[i].FieldName]).isBetween(moment(vm.fields[i].FilterValue), moment(vm.fields[i].FilterValue2)))
                break
            }
            if (vm.sortfield !== '') {
              // if this is a date field we need to do a bit more work to convert and test for sorting
              if (vm.fields[i].DataType == 'Date') {
                var f = vm.fields[i].FieldName
                p = Vue._.orderBy(
                  p,
                  function(o) {
                    return new moment(o[f]).format('YYYYMMDD')
                  },
                  vm.sortdir
                )
              } else {
                p = Vue._.orderBy(p, vm.sortfield, vm.sortdir)
              }
            }
          }
        }
      }
      vm.filtereddata = p
    },
    clearfilter: function(e) {
      var f = String(e.target.id).split('_')[1]
      // console.log('CLEARING FILTER: ' + f)
      for (var i = 1; i < vm.fields.length; i++) {
        if (vm.fields[i].FieldName == f) {
          vm.fields[i].Predicate = 'S'
          vm.fields[i].FilterValue = ''
          if (vm.fields[i].DataType == 'Date') {
            vm.fields[i].FilterValue2 = ''
          }
          if (vm.fields[i].DataType == 'Choice') {
            vm.fields[i].Predicate = 'E'
            vm.fields[i].Selected = 'S'
          }
          if (vm.fields[i].DataType == 'Number' && vm.fields[i].Control == 'DropdownBox') {
            vm.fields[i].Predicate = 'S'
            vm.fields[i].FilterValue = 'S'
          }
        }
      }
      vm.setfilter()
    },
    clearfilters: function() {
      window.localStorage.removeItem('manning')
      for (var i = 1; i < vm.fields.length; i++) {
        vm.fields[i].Predicate = 'S'
        vm.fields[i].FilterValue = ''
        vm.fields[i].Sort = ''
        if (vm.fields[i].DataType == 'Date') {
          vm.fields[i].FilterValue2 = ''
        }
        if (vm.fields[i].DataType == 'Choice') {
          vm.fields[i].Predicate = 'E'
          vm.fields[i].Selected = 'S'
        }
        if (vm.fields[i].DataType == 'Number' && vm.fields[i].Control == 'DropdownBox') {
          vm.fields[i].Predicate = 'S'
          vm.fields[i].FilterValue = 'S'
        }
      }
      vm.filtereddata = vm.features
      vm.setfilter()
    },
    savefilters: function() {
      this.fields[0].Value = this.appversion
      window.localStorage.setItem('manning', JSON.stringify(this.fields))
    },
    loadfilters: function() {
      let f = String(window.localStorage.getItem('manning'))
      if (f != 'null') {
        // here we will load the fields from local storage and test the version.
        // if the version matches the current app version then load the fields.
        // if not use the new fields from the file and alert the user that they need to rebuild their filters
        let flds = JSON.parse(f)
        let version = flds[0]['Value']
        // console.log('TEST POINT A: ' + version + ', flds: ' + flds)
        if (version == this.appversion) {
          // ask the user if they want to apply the saved filters or clear them
          this.$bvModal
            .msgBoxConfirm('Load your saved filter?', {
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
                this.fields = flds
                // loop to display the selected columns
                for (var i = 1; i < this.fields.length; i++) {
                  // starting at 1 to skip the version 'field'
                  if (this.fields[i].Visible) {
                    this.$refs.ManningGrid.showColumns(this.fields[i].DisplayName)
                    this.$refs.ManningGrid.autoFitColumns()
                  } else {
                    this.$refs.ManningGrid.hideColumns(this.fields[i].DisplayName)
                    this.$refs.ManningGrid.autoFitColumns()
                  }
                  if (this.fields[i].Sort !== '') {
                    this.sortfield = this.fields[i].FieldName
                    this.sortdir = this.fields[i].Sort
                  }
                }
                this.setfilter()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          // versions don't match so let the user know
          this.$bvModal.msgBoxOk('The fields have changed so you will need to reapply your filters', {
            title: 'Confirmation',
            size: 'md',
            buttonSize: 'md',
            okVariant: 'success',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true
          })
        }
      }
    }
  },
  provide: {
    grid: [Page, Edit, DetailRow, Toolbar, VirtualScroll, ExcelExport]
  }
}
</script>

<style lang="scss">
.modal-body {
  padding: 0.5rem !important;
}

.sorted {
  color: #04ee04 !important;
}

h3 {
  color: white;
}

.full {
  width: 100%;
}

#FilterModal .modal-dialog {
  margin: 1.75rem 0 auto !important;
}

#ShowFilters {
  height: 40px;
}

.tableHeight {
  height: calc(100vh - 130px);
}

#ulFields {
  list-style-type: none;
  background-color: white;
  color: black !important;
  width: 100%;
  margin-bottom: 10px;
  font-size: 16px !important;
  padding: 10px;
}

#ulFields li {
  list-style-type: none;
  margin-bottom: 5px !important;
}

.filterform {
  height: 22px !important;
  border: 1px solid black !important;
  border-radius: 4px !important;
  font-size: 1rem;
}

.e-label {
  font-size: 16px !important;
}

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

.e-pager {
  height: 60px;
}

.e-toolbar {
  min-height: 39px; /* There is a 1px top border so height will be 40px. Used in calculating #data rows */
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
