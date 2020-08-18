<template>
  <b-container fluid class="contentHeight">
    <b-toast id="busy-toast" variant="warning" solid no-auto-hide>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="#ff0000" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{ busyTitle }}</strong>
        </div>
      </template>
      <b-spinner style="width: 7rem; height: 7rem;" variant="success" label="Waiting Spinner"></b-spinner>
    </b-toast>
    <edit-travel :TripId="TripId" :Show="EditTravel" v-on:close="setClosed('edit')" :mode="mode"></edit-travel>
    <new-travel :Show="NewTravel" :Start="SelectedStart" :End="SelectedEnd" v-on:close="setClosed('new')" :mode="mode"></new-travel>
    <trip-report :TripId="TripId" :Show="TripReport" v-on:close="setClosed('report')" :mode="mode"></trip-report>
    <b-row v-if="mode == 'calendar'" ref="CalendarRow" class="contentHeight">
      <ejs-schedule
        id="TravelCalendar"
        ref="TravelCalendar"
        cssClass="contentHeight"
        :enablePersistence="false"
        :eventSettings="eventSettings"
        :selectedDate="defaultDate"
        :views="views"
        :currentView="currentView"
        :eventRendered="onEventRendered"
        :eventClick="onEventClick"
        :moreEventsClick="onMoreEventsClick"
        :cellClick="onCellClick"
        :select="onSelect"
        :actionBegin="onActionBegin"
        :actionComplete="onActionComplete"
      >
        <e-views>
          <e-view option="Day"></e-view>
          <e-view option="Week"></e-view>
          <e-view option="Month"></e-view>
        </e-views>
      </ejs-schedule>
    </b-row>
    <b-row v-else ref="GridRow" class="contentHeight">
      <b-modal ref="FilterModal" id="FilterModal" size="sm" no-fade modal-class="animated bounceInLeft">
        <template v-slot:modal-title>Travel Filter</template>
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
              id="TravelGrid"
              ref="TravelGrid"
              :enablePersistence="false"
              :dataSource="filteredtravel"
              :allowPaging="true"
              :allowResizing="true"
              :pageSettings="pageSettings"
              :editSettings="editSettings"
              :toolbar="toolbar"
              :allowExcelExport="true"
              :toolbarClick="toolbarClick"
              :dataBound="dataBound"
              :actionBegin="actionBegin"
              :actionComplete="actionComplete"
              :rowDataBound="rowDataBound"
              rowHeight="20"
              height="100%"
              width="100%"
            >
              <e-columns>
                <e-column headerText="Actions" textAlign="Left" width="100" :template="ActionsTemplate"></e-column>
                <e-column field="Status" headerText="Status" width="120"></e-column>
                <e-column field="Comments" headerText="Purpose" textAlign="Left" width="350"></e-column>
                <e-column field="WorkPlanNumber" headerText="Workplan Number" textAlign="Left" width="150"></e-column>
                <e-column field="WorkPlanText" headerText="Workplan Name" textAlign="Left" width="250"></e-column>
                <e-column field="IndexNumber" headerText="Index Number" textAlign="Left" width="140"></e-column>
                <e-column field="Created" headerText="Travel Requested" textAlign="Left" width="150" type="date" format="yMd"></e-column>
                <e-column field="StartTime" headerText="Departure Date" textAlign="Left" width="140" type="date" format="yMd"></e-column>
                <e-column field="EndTime" headerText="Return Date" textAlign="Left" width="140" type="date" format="yMd"></e-column>
                <e-column headerText="Travelers" textAlign="Left" width="200" :template="TravelersTemplate"></e-column>
                <e-column field="Company" headerText="Company" textAlign="Left" width="150"></e-column>
                <e-column field="Sponsor" headerText="Sponsor" textAlign="Left" width="150"></e-column>
                <e-column field="EstimatedCost" headerText="Est Cost" textAlign="Left" width="100"></e-column>
                <e-column field="PreApproved" headerText="Pre Approved" textAlign="Left" width="100"></e-column>
                <e-column field="VisitRequest" headerText="Visit Request" textAlign="Left" width="150"></e-column>
                <e-column field="Clearance" headerText="Clearance" textAlign="Left" width="100"></e-column>
                <e-column field="OCONUS" headerText="OCONUS" textAlign="Left" width="100"></e-column>
                <e-column field="OCONUSLocation" headerText="OCONUS Location" textAlign="Left" width="150"></e-column>
                <e-column field="OCONUSApprovedBy" headerText="OCONUS Approved By" textAlign="Left" width="180"></e-column>
                <e-column field="OCONUSApprovedOn" headerText="OCONUS Approved Date" textAlign="Left" width="200" type="date" format="yMd"></e-column>
                <e-column field="TravelFrom" headerText="Travel From" textAlign="Left" width="150"></e-column>
                <e-column field="TravelTo" headerText="Travel To" textAlign="Left" width="150"></e-column>
                <e-column field="POCName" headerText="POC Name" textAlign="Left" width="120"></e-column>
                <e-column field="POCEmail" headerText="POC Email" textAlign="Left" width="180"></e-column>
                <e-column field="POCPhone" headerText="POC Phone" textAlign="Left" width="100"></e-column>
                <e-column field="SecurityAction" headerText="Security Action" textAlign="Left" width="200"></e-column>
                <e-column field="SecurityActionCompleted" headerText="Security Action Completed" textAlign="Left" width="200" type="date" format="yMd"></e-column>
                <e-column field="TripReport" headerText="Trip Report" textAlign="Left" width="180" :template="TripReportTemplate"></e-column>
                <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true"></e-column>
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
import { SchedulePlugin, Day, Week, Month } from '@syncfusion/ej2-vue-schedule'
import { Page, Edit, Toolbar, VirtualScroll, ExcelExport, DetailRow } from '@syncfusion/ej2-vue-grids'
import User from '@/models/User'
import Travel from '@/models/Travel'
import EditTravel from './EditTravel'
import NewTravel from './NewTravel'
import TripReport from './TripReport'

Vue.use(SchedulePlugin)

let vm = null
let data = []

export default {
  name: 'Tracker',
  components: {
    EditTravel,
    NewTravel,
    TripReport
  },
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
  errorCaptured(err, vm, info) {
    const notification = {
      type: 'danger',
      title: 'Error in traveltracker.vue ' + err,
      message: info,
      push: true
    }
    this.$store.dispatch('notification/add', notification, { root: true })
  },
  computed: {
    travelloaded() {
      return Travel.getters('loaded')
    },
    travel() {
      return Travel.getters('allTravel')
    },
    appversion() {
      return User.getters('AppVersion')
    },
    currentuser() {
      return User.getters('CurrentUser')
    },
    offset() {
      let o = this.$moment().utcOffset()
      o = o * -1
      return o
    }
  },
  provide: {
    schedule: [Day, Week, Month],
    grid: [Page, Edit, DetailRow, Toolbar, VirtualScroll, ExcelExport]
  },
  data: function() {
    return {
      busyTitle: 'Getting Data. Please Wait.',
      moreevents: false,
      routeCount: 0,
      sortfield: '',
      sortdir: '',
      filteredtravel: [],
      TripId: 0,
      EditTravel: false,
      NewTravel: false,
      TripReport: false,
      IndexNumber: null,
      data: [],
      selectedDate: null,
      SelectedStart: null,
      SelectedEnd: null,
      defaultDate: new Date(),
      currentView: 'Month',
      views: ['Day', 'Week', 'Month'],
      eventSettings: {
        dataSource: data
      },
      height: '100%',
      fields: [
        {
          FieldName: 'Version',
          Value: null
        },
        {
          FieldName: 'Status',
          Visible: true,
          DisplayName: 'Status',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          DropdownSource: 'status',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: [
            { text: 'Select...', value: 'S' },
            { text: 'WPMReview', value: 'WPMReview' },
            { text: 'Approved', value: 'Approved' },
            { text: 'Rejected', value: 'Rejected' },
            { text: 'ReportFiled', value: 'ReportFiled' },
            { text: 'AFRLReview', value: 'AFRLReview' },
            { text: 'ATPRequested', value: 'ATPRequested' },
            { text: 'ATPApproved', value: 'ATPApproved' },
            { text: 'Completed', value: 'Completed' }
          ]
        },
        {
          FieldName: 'Comments',
          Visible: true,
          DisplayName: 'Purpose',
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
          DisplayName: 'Workplan Number',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'WorkplanText',
          Visible: true,
          DisplayName: 'Workplan Name',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'IndexNumber',
          Visible: true,
          DisplayName: 'Index Number',
          Filter: false,
          Control: '',
          DataType: 'Number',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Created',
          Visible: true,
          DisplayName: 'Travel Requested',
          Filter: false,
          Control: '',
          DataType: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        },
        {
          FieldName: 'StartTime',
          Visible: true,
          DisplayName: 'Departure Date',
          Filter: false,
          Control: '',
          DataType: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        },
        {
          FieldName: 'EndTime',
          Visible: true,
          DisplayName: 'Return Date',
          Filter: false,
          Control: '',
          DataType: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
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
          FieldName: 'Sponsor',
          Visible: true,
          DisplayName: 'Sponsor',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'EstimatedCost',
          Visible: true,
          DisplayName: 'Est Cost',
          Filter: false,
          Control: '',
          DataType: 'Number',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'PreApproved',
          Visible: true,
          DisplayName: 'Pre Approved',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: [
            { text: 'Select...', value: 'S' },
            { text: 'Yes', value: 'Yes' },
            { text: 'No', value: 'No' }
          ]
        },
        {
          FieldName: 'VisitRequest',
          Visible: true,
          DisplayName: 'Visit Request',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          DropdownSource: 'yesno',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: [
            { text: 'Select...', value: 'S' },
            { text: 'Yes', value: 'Yes' },
            { text: 'No', value: 'No' }
          ]
        },
        {
          FieldName: 'Clearance',
          Visible: true,
          DisplayName: 'Clearance',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          DropdownSource: 'clearance',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: [
            { text: 'Select...', value: 'S' },
            { text: 'None', value: 'None' },
            { text: 'S', value: 'S' },
            { text: 'TS', value: 'TS' },
            { text: 'TS/SCI', value: 'TS/SCI' }
          ]
        },
        {
          FieldName: 'OCONUS',
          Visible: true,
          DisplayName: 'OCONUS',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          DropdownSource: 'yesno',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: [
            { text: 'Select...', value: 'S' },
            { text: 'Yes', value: 'Yes' },
            { text: 'No', value: 'No' }
          ]
        },
        {
          FieldName: 'OCONUSLocation',
          Visible: true,
          DisplayName: 'OCONUS Location',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          DropdownSource: 'olocations',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: [
            { text: 'Select...', value: 'S' },
            { text: 'Germany', value: 'Germany' },
            { text: 'Korea', value: 'Korea' },
            { text: 'Other', value: 'Other' }
          ]
        },
        {
          FieldName: 'OCONUSApprovedBy',
          Visible: true,
          DisplayName: 'OCONUS Approved By',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'OCONUSApprovedOn',
          Visible: true,
          DisplayName: 'OCONUS Approved Date',
          Filter: false,
          Control: '',
          DataType: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        },
        {
          FieldName: 'TravelFrom',
          Visible: true,
          DisplayName: 'Travel From',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'TravelTo',
          Visible: true,
          DisplayName: 'Travel To',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'POCName',
          Visible: true,
          DisplayName: 'POC Name',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'POCEmail',
          Visible: true,
          DisplayName: 'POC Email',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'POC Phone',
          Visible: true,
          DisplayName: 'POC Phone',
          Filter: false,
          Control: '',
          DataType: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'SecurityAction',
          Visible: true,
          DisplayName: 'Security Action',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          DropdownSource: 'actions',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: '',
          Options: [
            { text: 'Select...', value: 'S' },
            { text: 'Collateral VR Sent', value: 'Collateral VR Sent' },
            { text: 'SCI VR Sent', value: 'SCI VR Sent' },
            { text: 'Verified VR Processed in JPAS', value: 'Verified VR Processed in JPAS' },
            { text: 'Contacted Sub FSO', value: 'Contacted Sub FSO' }
          ]
        },
        {
          FieldName: 'SecurityActionCompleted',
          Visible: true,
          DisplayName: 'Security Action Completed',
          Filter: false,
          Control: '',
          DataType: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        }
      ],
      ddfields: { text: 'text', value: 'value' },
      textpredicate: [
        { text: 'Select...', value: 'S' },
        { text: 'Starts With', value: 'SW' },
        { text: 'Ends With', value: 'EW' },
        { text: 'Contains', value: 'C' },
        { text: 'Equal', value: 'E' },
        { text: 'Not Equal', value: 'NE' }
      ],
      datepredicate: [
        { text: 'Select...', value: 'S' },
        { text: 'Greater Than', value: 'GT' },
        { text: 'Less Than', value: 'LT' },
        { text: 'Equal', value: 'E' },
        { text: 'Between', value: 'B' }
      ],
      numberpredicate: [
        { text: 'Select...', value: 'S' },
        { text: 'Greater Than', value: 'GT' },
        { text: 'Less Than', value: 'LT' },
        { text: 'Equal', value: 'E' }
      ],
      pageSettings: { pageSize: 30 },
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: false, mode: 'Dialog' },
      toolbar: ['Add', 'Print', 'Search', 'ExcelExport'],
      rowData: {},
      legenditems: [
        {
          id: 0,
          type: 'alert',
          name: 'ReportLate',
          variant: 'red'
        },
        {
          id: 1,
          type: 'alert',
          name: 'ReportDue',
          variant: 'yellow',
          classes: 'text-dark'
        },
        {
          id: 2,
          type: 'alert',
          name: 'Approved',
          variant: 'orange',
          classes: 'text-dark'
        },
        {
          id: 3,
          type: 'alert',
          name: 'WPMReview',
          variant: 'blue'
        },
        {
          id: 4,
          type: 'alert',
          name: 'AFRLReview',
          variant: 'cyan'
        },
        {
          id: 5,
          type: 'alert',
          name: 'Completed',
          variant: 'green'
        }
      ],
      TravelersTemplate: function() {
        return {
          template: Vue.component('columnTemplate', {
            template: `
              <div v-for="(traveler, index) in travelers" :key="traveler">
                <span><span v-if="index > 0">, </span>{{traveler.firstName}} {{traveler.lastName}}</span>
              </div>
            `,
            data: function() {
              return {
                data: {}
              }
            },
            computed: {
              travelers() {
                return JSON.parse(this.data.Travelers)
              }
            }
          })
        }
      },
      TripReportTemplate: function() {
        return {
          template: Vue.component('columnTemplate', {
            template: `
              <div>
                <a :href="href">{{ tripreport }}</span>
              </div>
            `,
            data: function() {
              return {
                data: {}
              }
            },
            computed: {
              tripreport() {
                return this.data.TripReport
              },
              href() {
                return this.data.TripReportLink
              }
            }
          })
        }
      },
      ActionsTemplate: function() {
        return {
          template: Vue.component('actionsTemplate', {
            template: `
            <div>
              <b-button variant="success" class="actionbutton" @click="edit(data)" title="Edit Travel">
                <font-awesome-icon far icon="edit" class="icon"></font-awesome-icon>
              </b-button>
              <b-button variant="success" class="actionbutton" @click="report(data)" title="Add/Edit Trip Report">
                <font-awesome-icon far icon="upload" class="icon"></font-awesome-icon>
              </b-button>
            </div>`,
            data: function() {
              return {
                data: {}
              }
            },
            computed: {
              isPM() {
                return User.getters('isPM')
              },
              isDeveloper() {
                return User.getters('isDeveloper')
              },
              isWPManager() {
                return User.getters('isWPManager')
              },
              isMSRInputter() {
                return User.getters('isMSRInputter')
              }
            },
            methods: {
              edit: function(data) {
                // TODO: close any modal that may be open. Most likely should never have one open at this point. Then set travelid to selected travel and open edit form
                vm.EditTravel = false
                vm.TripId = data.Id
                vm.EditTravel = true
              },
              report: function(data) {
                vm.IndexNumber = data.IndexNumber
                vm.TripReport = false
                vm.TripId = data.Id
                vm.TripReport = true
              }
            }
          })
        }
      }
    }
  },
  mounted: function() {
    vm = this
    this.$store.dispatch('support/addActivity', '<div class="bg-info">traveltracker-MOUNTED: ' + this.mode + '</div>')
    // Get Travel. This will make sure that the latest travel items are available.
    if (this.mode == 'refreshtracker') {
      this.$router.push({ path: '/travel/home/tracker' })
    }
    if (this.mode == 'refreshcalendar') {
      this.$router.push({ path: '/travel/home/calendar' })
    }
    if (this.mode == 'edit') {
      Travel.dispatch('getDigest')
      this.$bvToast.show('busy-toast')
      Travel.dispatch('getTRIPS').then(function() {
        vm.$bvToast.hide('busy-toast')
        vm.$options.interval = setInterval(vm.waitForEvents, 1000)
      })
    }
    if (this.mode == 'new') {
      Travel.dispatch('getDigest')
      this.$bvToast.show('busy-toast')
      Travel.dispatch('getTRIPS').then(function() {
        vm.$bvToast.hide('busy-toast')
        vm.$options.interval = setInterval(vm.waitForEvents, 1000)
      })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('support/setLegendItems', [])
  },
  methods: {
    waitForEvents: function() {
      this.$store.dispatch('support/addActivity', '<div class="bg-info">traveltracker-WAITING FOR EVENTS:  ' + this.mode + '</div>')
      if (this.travel && this.travel.length > 0) {
        this.$bvToast.hide('busy-toast')
        clearInterval(this.$options.interval)
        document.getElementById('PageTitle').innerHTML = ' - ' + this.capitalizeFirstLetter(this.mode)
        if (this.mode == 'calendar') {
          if (console) {
            console.log('SETTING CALENDAR EVENTS: ' + this.travel.length)
          }
          let oldevents = this.$refs.TravelCalendar.getEvents()
          this.$refs.TravelCalendar.deleteEvent(oldevents)
          this.$refs.TravelCalendar.addEvent(this.travel)
        } else {
          this.filteredtravel = Vue._.orderBy(this.travel, 'Id', 'desc')
          // load any saved filters
          this.loadfilters()
          this.fields[9]['Options'] = this.companies
          if (this.mode == 'edit') {
            let id = Number(this.$route.query.id)
            this.EditTravel = false
            this.TripId = id
            this.EditTravel = true
          }
          if (this.mode == 'new') {
            this.NewTravel = true
          }
        }
        this.$store.dispatch('support/setLegendItems', this.legenditems)
      }
    },
    getRef: function(text, idx) {
      return text + '_' + idx
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    setClosed: function(dialog) {
      switch (dialog) {
        case 'new':
          this.SelectedStart = null
          this.SelectedEnd = null
          this.NewTravel = false
          break

        case 'edit':
          this.EditTravel = false
          break

        case 'report':
          this.TripReport = false
          break
      }
    },
    /* ----------------------------------------------------------------------------------- BEGIN TRACKER EVENTS -------------------------------------------------------------------------------- */
    toolbarClick: function(args) {
      switch (args.item.id) {
        case 'TravelGrid_excelexport':
          this.$refs['TravelGrid'].excelExport()
          break

        case 'TravelGrid_print':
          this.$refs['TravelGrid'].print()
          break
      }
    },
    ToggleFilters() {
      this.$refs['FilterModal'].toggle('#ShowFilters')
    },
    actionBegin(args) {
      // if (console) { console.log('ACTION BEGIN: ' + args.requestType) }
      switch (args.requestType) {
        case 'add':
          args.cancel = true
          vm.SelectedStart = null
          vm.SelectedEnd = null
          vm.NewTravel = true
          break
      }
    },
    actionComplete(args) {
      // if (console) { console.log('ACTION COMPLETE: ' + args.requestType) }
      if (args.requestType == 'columnstate') {
        this.$refs['TravelGrid'].autoFitColumns()
      }
      if (args.requestType == 'refresh') {
        let h1 = 0
        let h2 = this.$refs.TravelGrid.$el.children[7].children[0].clientHeight // cildren[7] matches .e-gridconent
        h1 = Math.floor(h2 / 20)
        this.pageSettings.pageSize = h1
        this.$refs.TravelGrid.pageSettings = { pageSize: h1 }
      }
    },
    dataBound: function() {
      this.$refs.TravelGrid.autoFitColumns()
    },
    rowDataBound: function(args) {
      let c = String(args.data['Status'])
      switch (c) {
        case 'Approved': {
          args.row.classList.add('bg-orange', 'text-dark')
          break
        }

        case 'WPMReview': {
          args.row.classList.add('bg-blue', 'text-white')
          break
        }

        case 'AFRLReview': {
          args.row.classList.add('bg-cyan', 'text-white')
          break
        }

        case 'ReportDue': {
          args.row.classList.add('bg-yellow', 'text-dark')
          break
        }

        case 'ReportLate': {
          args.row.classList.add('bg-red', 'text-white')
          break
        }

        case 'Completed': {
          args.row.classList.add('bg-green', 'text-white')
          break
        }
      }
      // args.row.classList.add(c)
    },
    hideme: function(modal, action) {
      vm.$bvModal.hide(modal)
      if (action == 'refresh') {
        vm.$router.push({ name: 'Refresh', params: { action: 'travel' } })
      }
    },
    sortup: function(e, t) {
      // ascending
      var p = this.filteredtravel
      if (t == 'Date') {
        p = Vue._.orderBy(
          p,
          function(o) {
            return new this.$moment(o[e]).format('YYYYMMDD')
          },
          'asc'
        )
      } else {
        p = Vue._.orderBy(p, e, 'asc')
      }
      this.filteredtravel = p
      this.$refs.TravelGrid.refresh()
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
      var p = this.filteredtravel
      if (t == 'Date') {
        p = Vue._.orderBy(
          p,
          function(o) {
            return new this.$moment(o[e]).format('YYYYMMDD')
          },
          'desc'
        )
      } else {
        p = Vue._.orderBy(p, e, 'desc')
      }
      this.filteredtravel = p
      this.$refs.TravelGrid.refresh()
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
        this.$refs.TravelGrid.showColumns([displayname])
        this.$refs.TravelGrid.autoFitColumns()
      } else {
        this.$refs.TravelGrid.hideColumns([displayname])
        this.$refs.TravelGrid.autoFitColumns()
      }
    },
    setfilter: function() {
      // always reset to all records then do all filters as they are selected.
      // this is a top down filter
      // loop through all the fields and filter the ones that have a predicate and filtervalue set
      var p = this.travel // set initial filter to all based on the module. travel in this case
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
                  p = p.filter(search => this.$moment(search[vm.fields[i].FieldName]).isAfter(this.$moment(vm.fields[i].FilterValue)))
                }
                break

              case 'LT':
                // Less Than
                if (vm.fields[i].DataType == 'Number') {
                  p = p.filter(search => search[vm.fields[i].FieldName] < vm.fields[i].FilterValue)
                } else {
                  // date
                  p = p.filter(search => this.$moment(vm.fields[i].FilterValue).isAfter(this.$moment(search[vm.fields[i].FieldName])))
                }
                break

              case 'B':
                // Between
                p = p.filter(search => this.$moment(search[vm.fields[i].FieldName]).isBetween(this.$moment(vm.fields[i].FilterValue), this.$moment(vm.fields[i].FilterValue2)))
                break
            }
            if (vm.sortfield !== '') {
              // if this is a date field we need to do a bit more work to convert and test for sorting
              if (vm.fields[i].DataType == 'Date') {
                var f = vm.fields[i].FieldName
                p = Vue._.orderBy(
                  p,
                  function(o) {
                    return new this.$moment(o[f]).format('YYYYMMDD')
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
      vm.filteredtravel = p
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
      window.localStorage.removeItem('travel')
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
      vm.filteredtravel = vm.travel
      vm.setfilter()
    },
    savefilters: function() {
      this.fields[0].Value = this.appversion
      window.localStorage.setItem('travel', JSON.stringify(this.fields))
    },
    loadfilters: function() {
      let f = String(window.localStorage.getItem('travel'))
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
                    this.$refs.TravelGrid.showColumns(this.fields[i].DisplayName)
                    this.$refs.TravelGrid.autoFitColumns()
                  } else {
                    this.$refs.TravelGrid.hideColumns(this.fields[i].DisplayName)
                    this.$refs.TravelGrid.autoFitColumns()
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
    },
    /* ----------------------------------------------------------------------------------- END TRACKER EVENTS ----------------------------------------------------------------------------------- */
    /* ----------------------------------------------------------------------------------- BEGIN CALENDAR EVENTS -------------------------------------------------------------------------------- */
    onCellClick: function(args) {
      args.cancel = true
      if (this.moreevents) {
        // do nothing here
        this.moreevents = false
      } else {
        if (this.NewTravel == false) {
          let s = args.startTime
          let e = args.endTime
          s = this.$moment(s).format() // 'YYYY-MM-DD[T]HH:MM:[00Z]'
          s = this.$moment(s)
            .utc()
            .format()
          s = this.$moment(s)
            .add(this.offset, 'm')
            .format()
          s = this.$moment(s).format('YYYY-MM-DD')
          this.$store.dispatch('support/addActivity', '<div class="bg-info">traveltracker-onSelect: s: ' + s + '</div>')
          e = this.$moment(e).format()
          e = this.$moment(e)
            .utc()
            .format()
          e = this.$moment(e)
            .subtract(this.offset, 'm')
            .format()
          e = this.$moment(e).format('YYYY-MM-DD')
          this.NewTravel = true
          this.SelectedStart = s
          this.SelectedEnd = e
          let html = ''
          html += '<div class="bg-info">traveltracker-onCellClick: SelectedStart: ' + s + '</div><br/>'
          html += '<div class="bg-info">traveltracker-onCellClick: SelectedEnd: ' + e + '</div><br/>'
          this.$store.dispatch('support/addActivity', html)
        }
      }
    },
    onSelect: function(args) {
      args.cancel = true
      /* if (console) {
        console.log('ONSELECT: ' + args.requestType)
      } */
      if (args.requestType === 'cellSelect') {
        let s = args.data.StartTime
        let e = args.data.EndTime
        s = this.$moment(s).format() // 'YYYY-MM-DD[T]HH:MM:[00Z]'
        s = this.$moment(s)
          .utc()
          .format()
        s = this.$moment(s)
          .add(this.offset, 'm')
          .format()
        s = this.$moment(s).format('YYYY-MM-DD')
        this.$store.dispatch('support/addActivity', '<div class="bg-info">traveltracker-onSelect: s: ' + s + '</div>')
        e = this.$moment(e).format()
        e = this.$moment(e)
          .utc()
          .format()
        e = this.$moment(e)
          .subtract(this.offset, 'm')
          .format()
        e = this.$moment(e).format('YYYY-MM-DD')
        this.$store.dispatch('support/addActivity', '<div class="bg-info">traveltracker-onSelect: e: ' + e + '</div>')
        this.NewTravel = true
        this.SelectedStart = s
        this.SelectedEnd = e
        /* let html = ''
        html += '<div class="bg-info">traveltracker-onSelect: SelectedStart: ' + s + '</div><br/>'
        html += '<div class="bg-info">traveltracker-onSelect: SelectedEnd: ' + e + '</div><br/>'
        this.$store.dispatch('support/addActivity', html) */
      }
    },
    onEventRendered: function(args) {
      let c = args.data.Status
      switch (c) {
        case 'Approved': {
          args.element.classList.add('bg-orange', 'text-dark')
          break
        }

        case 'WPMReview': {
          args.element.classList.add('bg-blue')
          break
        }

        case 'AFRLReview': {
          args.element.classList.add('bg-cyan')
          break
        }

        case 'ReportDue': {
          args.element.classList.add('bg-yellow', 'text-dark')
          break
        }

        case 'ReportLate': {
          args.element.classList.add('bg-red')
          break
        }

        case 'Completed': {
          args.element.classList.add('bg-green')
          break
        }
      }
    },
    onEventClick(args) {
      args.cancel = true
      this.EditTravel = false
      this.TripId = args.event.id
      if (this.moreevents) {
        this.moreevents = false
      } else {
        this.EditTravel = true
      }
    },
    onMoreEventsClick: function() {
      this.moreevents = true
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log('TRAVELTRACKER.VUE TO: ' + to + ', FROM: ' + from)
    next()
  },
  watch: {
    $route(to, from) {
      if (console) {
        console.log('ROUTE TO: ' + to + ', FROM: ' + from)
      }
      this.mode = to.params.mode
      switch (this.mode) {
        case 'view': {
          document.getElementById('PageTitle').innerHTML = ' -  View'
          this.selectedtrip = {} // clear any existing item
          let id = Number(this.$route.query.id)
          var trip = this.travel.filter(trip => trip.id == id)
          trip = trip[0]
          trip.Travelers = JSON.parse(trip.Travelers)
          this.selectedtrip = trip
          this.$bvModal.show('ViewModal')
          break
        }

        case 'new': {
          document.getElementById('PageTitle').innerHTML = ' -  New Travel Request'
          this.NewTravel = true
          break
        }

        case 'edit': {
          Travel.dispatch('getDigest')
          this.$bvToast.show('busy-toast')
          Travel.dispatch('getTRIPS').then(function() {
            vm.$bvToast.hide('busy-toast')
            vm.$options.interval = setInterval(vm.waitForEvents, 1000)
          })
          break
        }

        case 'refreshtracker': {
          this.$router.push({ path: '/travel/home/tracker' })
          break
        }

        case 'refreshcalendar': {
          this.$router.push({ path: '/travel/home/calendar' })
          break
        }

        case 'tracker': {
          if (console) {
            console.log('LOADING: ' + this.mode)
          }
          Travel.dispatch('getDigest')
          this.$bvToast.show('busy-toast')
          Travel.dispatch('getTRIPS').then(function() {
            vm.$bvToast.hide('busy-toast')
            vm.$options.interval = setInterval(vm.waitForEvents, 1000)
          })
          break
        }

        case 'calendar': {
          if (console) {
            console.log('LOADING: ' + this.mode)
          }
          Travel.dispatch('getDigest')
          this.$bvToast.show('busy-toast')
          Travel.dispatch('getTRIPS').then(function() {
            vm.$bvToast.hide('busy-toast')
            vm.$options.interval = setInterval(vm.waitForEvents, 1000)
          })
          break
        }
      }
    }
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

.e-time {
  display: none !important;
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
