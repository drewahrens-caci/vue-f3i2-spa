<template>
  <b-container fluid class="p-0" id="Calendar">
    <b-modal id="modal-wizard" size="xl" centered hide-header hide-footer @hide="onModalHide">
      <div class="d-block text-center">
        <keep-alive>
          <form-wizard id="TravelWizard" ref="TravelWizard" title="New Travel Request" subtitle="" color="#fd7e14" error-color="#ff0000" shape="tab" @on-complete="onComplete" :start-index="stepIndex">
            <tab-content id="Tab_0" title="Travel Information" icon="ti-user" :before-change="validateFirstTab">
              <b-form>
                <b-row>
                  <b-col md="12">Subject</b-col>
                </b-row>
                <b-row>
                  <b-col md="12"><b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.Subject" :state="ValidateMe('Subject')" ref="Subject"></b-form-input></b-col>
                  <b-form-invalid-feedback>
                    Enter a subject for this travel request
                  </b-form-invalid-feedback>
                </b-row>
                <b-row>
                  <b-col md="6">Company</b-col>
                  <b-col md="6">WorkPlan</b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.Company" :state="ValidateMe('Company')" ref="Company"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter at least 3 letters
                    </b-form-invalid-feedback>
                  </b-col>
                  <b-col md="6">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.WorkPlan" :state="ValidateMe('WorkPlan')" ref="WorkPlan"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter in YY-XXXX format (Proper WorkPlan format)
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">Start Date</b-col>
                  <b-col md="6">End Date</b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-input v-model="travelmodel.StartTime" ref="start" type="date" title="Start" :state="ValidateMe('start')"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter a valid date (mm/dd/yyyy)
                    </b-form-invalid-feedback>
                  </b-col>
                  <b-col md="6">
                    <b-form-input v-model="travelmodel.EndTime" ref="end" type="date" title="End" :state="ValidateMe('end')"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter a valid date (mm/dd/yyyy)
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="6">Traveling From</b-col>
                  <b-col md="6">Traveling To</b-col>
                </b-row>
                <b-row>
                  <b-col md="6">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.TravelFrom" :state="ValidateMe('TravelFrom')" ref="TravelFrom"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter at least 3 letters
                    </b-form-invalid-feedback>
                  </b-col>
                  <b-col md="6">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.TravelTo" :state="ValidateMe('TravelTo')" ref="TravelTo"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter at least 3 letters
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>
              </b-form>
            </tab-content>
            <tab-content id="Tab_1" title="Traveler Details" icon="ti-user" :before-change="validateSecondTab">
              <b-row>
                <b-col cols="12" class="px-0">
                  <b-form>
                    <b-table
                      id="TravelersTable"
                      ref="TravelersTable"
                      responsive
                      v-model="travelerData"
                      :tbody-tr-class="rowClass"
                      :striped="striped"
                      :bordered="bordered"
                      :small="small"
                      :hover="hover"
                      :items="travelmodel.Travelers"
                      :fields="fields"
                      style="table-layout: fixed;"
                    >
                      <template v-slot:cell(firstName)="data">
                        <b-form-input class="form-control-sm" v-model="travelerData[data.index].firstName" v-bind:id="getRef('trvlfirstName', data.index)" title="First Name" :state="validateLength('trvlfirstName_' + data.index, 1)"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter at least 2 letters
                        </b-form-invalid-feedback>
                      </template>
                      <template v-slot:cell(lastName)="data">
                        <b-form-input class="form-control-sm" v-model="travelerData[data.index].lastName" v-bind:id="getRef('trvllastName', data.index)" title="Last Name" :state="validateLength('trvllastName_' + data.index, 1)"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter at least 2 letters
                        </b-form-invalid-feedback>
                      </template>
                      <template v-slot:cell(email)="data">
                        <b-form-input class="form-control-sm" v-model="travelerData[data.index].email" v-bind:id="getRef('trvlemail', data.index)" title="Email" :state="validateEmail('trvlemail_' + data.index)"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter a proper email address
                        </b-form-invalid-feedback>
                      </template>
                      <template v-slot:cell(phone)="data">
                        <b-form-input class="form-control-sm" v-model="travelerData[data.index].phone" v-bind:id="getRef('trvlphone', data.index)" title="Phone" :state="validatePhone('trvlphone_' + data.index)"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter a number in (###)-###-#### format
                        </b-form-invalid-feedback>
                      </template>
                    </b-table>
                  </b-form>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <b-button size="sm" @click="btnAddClick" variant="success">Add Traveler</b-button>
                </b-col>
              </b-row>
            </tab-content>
            <tab-content id="Tab_2" title="Additional Info" icon="ti-settings" :before-change="validateThirdTab">
              <b-form>
                <b-row>
                  <b-col md="4">Gov Sponsor</b-col>
                  <b-col md="4">Estimated Cost</b-col>
                  <b-col md="4">Travel Index #</b-col>
                </b-row>
                <b-row>
                  <b-col md="4">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.Sponsor" ref="Sponsor" :state="ValidateMe('Sponsor')"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter at least 5 letters
                    </b-form-invalid-feedback>
                  </b-col>
                  <b-col md="4">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.EstimatedCost" ref="EstimatedCost" :state="ValidateMe('EstimatedCost')"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter a valid cost in numbers only
                    </b-form-invalid-feedback>
                  </b-col>
                  <b-col md="4">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.IndexNumber" ref="IndexNumber" :state="ValidateMe('IndexNumber')"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter in YY-XXXX-ZZ format (Proper index format)
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="4">POC Name</b-col>
                  <b-col md="4">POC Email</b-col>
                  <b-col md="4">POC Phone</b-col>
                </b-row>
                <b-row>
                  <b-col md="4">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.POCName" ref="POCName" :state="ValidateMe('POCName')"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter at least 5 letters
                    </b-form-invalid-feedback>
                  </b-col>
                  <b-col md="4">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.POCEmail" ref="POCEmail" :state="ValidateMe('POCEmail')"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter a proper email address
                    </b-form-invalid-feedback>
                  </b-col>
                  <b-col md="4">
                    <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.POCPhone" ref="POCPhone" :state="ValidateMe('POCPhone')"></b-form-input>
                    <b-form-invalid-feedback>
                      Enter a number in (###)-###-#### format
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="12">Purpose</b-col>
                </b-row>
                <b-row>
                  <b-col md="12">
                    <b-form-textarea class="form-control-sm form-control-travel" v-model="travelmodel.Comments" placeholder="Purpose of this trip..." rows="3" max-rows="6" ref="Comments" :state="ValidateMe('Comments')"></b-form-textarea>
                    <b-form-invalid-feedback>
                      Enter at least 5 letters
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="12"><b-form-checkbox class="form-control-sm" v-model="travelmodel.VisitRequest" name="checkbox-1" value="yes" unchecked-value="no" ref="VisitRequest">Visit Request Required</b-form-checkbox></b-col>
                </b-row>
                <b-row v-if="travelmodel.VisitRequest === 'yes'">
                  <b-col md="12">
                    <b-form-select class="form-control-sm" v-model="travelmodel.Clearance" :options="levels" ref="Clearance" :state="ValidateMe('Clearance')"></b-form-select>
                    <b-form-invalid-feedback>
                      Please select a valid option
                    </b-form-invalid-feedback>
                  </b-col>
                </b-row>
              </b-form>
            </tab-content>
            <tab-content id="Tab_3" title="Validation" icon="ti-check">
              <h4>Your form is valid. Click "OK" to save or "Cancel" to close.</h4>
            </tab-content>
            <template slot="footer" scope="props">
              <div class="wizard-footer-left">
                <b-button variant="warning" v-if="props.activeTabIndex > 0 && !props.isLastStep" @click="props.prevTab()">Previous</b-button>
              </div>
              <div class="wizard-footer-right">
                <b-button variant="danger" @click="onModalCancel">
                  Cancel
                </b-button>
                <b-button variant="warning" v-if="!props.isLastStep" @click="props.nextTab()" class="wizard-footer-right ml-1">Next</b-button>
                <b-button variant="success" v-if="props.isLastStep" @click="onModalSave" class="wizard-footer-right ml-1">OK</b-button>
              </div>
            </template>
          </form-wizard>
        </keep-alive>
      </div>
    </b-modal>
    <b-row>
      <div class="titlebar">
        <span class="title">Travel Calendar</span>
      </div>
    </b-row>
    <b-row>
      <ejs-schedule
        id="TravelCalendar"
        ref="TravelCalendar"
        :height="height"
        :eventSettings="eventSettings"
        :selectedDate="defaultDate"
        :views="views"
        :currentView="currentView"
        :eventRendered="onEventRendered"
        :dragStop="onDragStop"
        :resizeStop="onResizeStop"
        :eventClick="onEventClick"
        :cellClick="onCellClick"
        :select="onSelect"
      >
        <e-views>
          <e-view option="Day"></e-view>
          <e-view option="Week"></e-view>
          <e-view option="Month"></e-view>
        </e-views>
      </ejs-schedule>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { FormWizard, TabContent } from 'vue-form-wizard'
import { DataManager } from '@syncfusion/ej2-data'
import { extend } from '@syncfusion/ej2-base'
import { SchedulePlugin, Day, Week, Month, View, Resize, DragAndDrop, Ej2Instances } from '@syncfusion/ej2-vue-schedule'
import Travel from '@/models/Travel'

Vue.use(SchedulePlugin)

var vm = null // setup a global instance pointer to the vue component. This is set in mounted

export default {
  name: 'Calendar',
  props: {
    mode: String
  },
  computed: {
    travel() {
      return Travel.getters('allTravel')
    },
    emailRequired() {
      return Travel.getters('emailRequired')
    }
  },
  components: {
    FormWizard,
    TabContent
  },
  provide: {
    schedule: [Day, Week, Month, Resize, DragAndDrop]
  },
  data: function() {
    return {
      stepIndex: 0,
      currentmode: 'default',
      height: '700px',
      selectedDate: null,
      defaultDate: new Date(),
      currentView: 'Month',
      views: ['Day', 'Week', 'Month'],
      eventSettings: {
        dataSource: []
      },
      travelmodel: {
        id: 0,
        WorkPlan: 'TestPlan',
        Company: 'CACI',
        Subject: 'Project Support Travel',
        StartTime: '',
        EndTime: '',
        TravelFrom: 'TravelFrom',
        TravelTo: 'TravelTo',
        Travelers: [
          {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'email@email.com',
            phone: '0000000000'
          }
        ],
        Sponsor: 'Bugs Bunny',
        POCName: 'Sylvester',
        POCEmail: 'email@email.com',
        POCPhone: '0000000000',
        Comments: 'This is test',
        Clearance: 'Select',
        VisitRequest: '',
        EstimatedCost: '2000',
        IndexNumber: '0008675309'
      },
      fieldsFirstTab: ['WorkPlan', 'Company', 'start', 'end', 'TravelFrom', 'TravelTo'],
      fieldsThirdTab: ['Sponsor', 'EstimatedCost', 'IndexNumber', 'POCName', 'POCEmail', 'POCPhone', 'Comments', 'Clearance'],
      travelerData: [
        {
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          phone: '000-000-0000'
        }
      ],
      formOptions: {
        validationErrorClass: 'has-error',
        validationSuccessClass: 'has-success',
        validateAfterChanged: true
      },
      formValid: false,
      striped: true,
      bordered: true,
      outlined: true,
      small: true,
      hover: true,
      dark: false,
      fixed: false,
      footClone: false,
      fields: [
        { key: 'actions', label: 'Action', thClass: 'text-center px40' },
        { key: 'firstName', label: 'First Name', thClass: 'text-center px80' },
        {
          key: 'lastName',
          label: 'Last Name',
          thClass: 'text-center px80',
          sortable: true
        },
        { key: 'email', label: 'Email', thClass: 'text-center px200' },
        { key: 'phone', label: 'Phone', thClass: 'text-center px100' }
      ],
      levels: [
        { value: 'Select', text: 'Select' },
        { value: 'S', text: 'S' },
        { value: 'TS', text: 'TS' },
        { value: 'TSSCI', text: 'TS/SCI' }
      ],
      requiresSecurity: false,
      securityEmail: {
        required: false,
        From: 'daniel.walker1@caci.com',
        To: { results: ['michele.dade@caci.com'] },
        Body: '',
        Subject: ''
      }
    }
  },
  mounted: function() {
    vm = this
    console.log('Mounted Mode: ' + this.mode)
    Travel.dispatch('getDigest')
    Travel.dispatch('getTRIPS').then(function() {
      vm.$options.interval = setInterval(vm.waitForEvents, 1000)
    })
    /* this.currentmode = this.mode
    
    if (this.currentmode === 'new') {
      this.currentmode = 'default'
      this.addTravel(moment())
    } */
  },
  methods: {
    getID: function(text, id) {
      return text + '_' + id
    },
    waitForEvents: function() {
      if (this.travel && this.travel.length > 0) {
        clearInterval(this.$options.interval)
        this.$refs.TravelCalendar.addEvent(this.travel)
      }
    },
    onModalHide: function() {
      console.log('MODAL HIDE')
      // this.$refs.TravelWizard.reset()
    },
    onModalCancel: function() {
      this.$bvModal.hide('modal-wizard')
    },
    onModalSave: function() {
      console.log('MODAL SAVE')
      // need to now use the information in the travelmodel and travelerData elements to add the event to the calendar and also to SharePoint list
      let event = []
      let start = moment(this.travelmodel.StartTime).format('MM/DD/YYYY')
      let end = moment(this.travelmodel.EndTime).format('MM/DD/YYYY')
      event.push({
        Subject: this.travelmodel.Subject,
        StartTime: start,
        EndTime: end,
        class: 'travel-new',
        WorkPlan: this.travelmodel.WorkPlan,
        Company: this.travelmodel.Company,
        TravelFrom: this.travelmodel.TravelFrom,
        TravelTo: this.travelmodel.TravelTo,
        Travelers: this.travelerData,
        Sponsor: this.travelmodel.Sponsor,
        POCName: this.travelmodel.POCName,
        POCEmail: this.travelmodel.POCEmail,
        POCPhone: this.travelmodel.POCPhone,
        Comments: this.travelmodel.Comments,
        Clearance: this.travelmodel.Clearance,
        VisitRequest: this.travelmodel.VisitRequest,
        EstimatedCost: this.travelmodel.EstimatedCost,
        IndexNumber: this.travelmodel.IndexNumber
      })
      this.$refs.TravelCalendar.addEvent(event)
      // now push this to the data module to save to sharepoint
      Travel.dispatch('addTrip', event).then(function(response) {
        console.log('Event added to SharePoint ' + response)
        // the id of the added item is now in the response object!
        let id = response.data.d.Id
        vm.$bvModal.hide('modal-wizard')
        // validate if email needs to be sent
        if (vm.emailRequired) {
          Travel.dispatch('sendEmail', id).then(function(response) {
            console.log('EMAIL SENT TO SECURITY')
          })
        }
      })
    },
    onCellClick: function(args) {
      console.log('CELL CLICKED: ' + args)
      args.cancel = true
      this.travelmodel.StartTime = moment(args.StartTime).format('YYYY-MM-DD')
      this.travelmodel.EndTime = moment(args.EndTime).format('YYYY-MM-DD')
      this.$bvModal.show('modal-wizard')
    },
    onSelect: function(args) {
      args.cancel = true
      if (args.requestType === 'cellSelect') {
        this.travelmodel.StartTime = moment(args.data.StartTime).format('YYYY-MM-DD')
        this.travelmodel.EndTime = moment(args.data.EndTime).format('YYYY-MM-DD')
        this.$bvModal.show('modal-wizard')
      }
    },
    onEventRendered: function(args) {
      let c = args.data.class
      if (!args.element || !c) {
        return
      }
      args.element.classList.add(c)
    },
    onEventClick: function(args) {
      console.log('EVENT CLICKED: ' + args)
      args.cancel = true
    },
    onDragStop: function(args) {
      console.log('DRAG STOPPED: ' + args)
    },
    onResizeStop: function(args) {
      console.log('RESIZED: ' + args)
    },
    rowClass(item, type) {
      if (!item) return
      if (item.delete === 'Y') return 'table-delete'
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    getRef(text, idx) {
      // console.log('getRef: ' + text + '_' + idx)
      return text + '_' + idx
    },
    onComplete: function() {
      alert('Yay. Done!')
    },
    ValidateMe: function(control) {
      let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
      let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      let ret = false
      switch (control) {
        case 'Subject':
          ret = this.travelmodel.Subject.length > 2 ? true : false
          break

        case 'Company':
          ret = this.travelmodel.Company.length > 2 ? true : false
          break

        case 'WorkPlan':
          ret = this.travelmodel.WorkPlan.length > 6 ? true : false
          break

        case 'IndexNumber':
          ret = this.travelmodel.IndexNumber.length > 8 ? true : false
          break

        case 'start':
          ret = moment(this.travelmodel.StartTime).isValid() ? true : false
          break

        case 'end':
          ret = moment(this.travelmodel.EndTime).isValid() ? true : false
          break

        case 'TravelFrom':
          ret = this.travelmodel.TravelFrom.length > 2 ? true : false
          break

        case 'TravelTo':
          ret = this.travelmodel.TravelTo.length > 2 ? true : false
          break

        case 'Sponsor':
          ret = this.travelmodel.Sponsor.length > 4 ? true : false
          break

        case 'EstimatedCost':
          ret = this.travelmodel.EstimatedCost.length > 1 ? true : false
          break

        case 'POCName':
          ret = this.travelmodel.POCName.length > 4 ? true : false
          break

        case 'POCEmail':
          ret = emailPattern.test(this.travelmodel.POCEmail) ? true : false
          break

        case 'POCPhone':
          ret = phoneNumberPattern.test(this.travelmodel.POCPhone) ? true : false
          break

        case 'Comments':
          ret = this.travelmodel.Comments.length > 4 ? true : false
          break

        case 'Clearance':
          let req = this.travelmodel.VisitRequest
          let val = this.travelmodel.Clearance
          let good = false
          if (req === 'yes' && val !== 'Select') {
            good = true
          }
          ret = good
          break
      }
      return ret
    },
    validateLength: function(value, lngth) {
      let a = String(value)
      a = a.split('_')
      let b = parseInt(a[1])
      let c = false
      switch (a[0]) {
        case 'trvlfirstName':
          if (this.travelerData[b].firstName.length > lngth) {
            c = true
          }
          break

        case 'trvllastName':
          if (this.travelerData[b].lastName.length > lngth) {
            c = true
          }
          break
      }
      return c
    },
    validateEmail: function(email) {
      let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      let a = String(email)
      a = a.split('_')
      let b = parseInt(a[1])
      return emailPattern.test(this.travelerData[b].email)
    },
    validatePhone: function(phone) {
      let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
      let a = String(phone)
      a = a.split('_')
      let b = parseInt(a[1])
      return phoneNumberPattern.test(this.travelerData[b].phone)
    },
    validateFirstTab: function() {
      // check all the fields in the first tab to see that they are properly validated
      this.$refs.TravelWizard.subtitle = ''
      let valid = true
      for (let i = 0; i < this.fieldsFirstTab.length; i++) {
        /* console.log(this.fieldsFirstTab[i] + ', ' + this.$refs[this.fieldsFirstTab[i]].state) */
        if (this.$refs[this.fieldsFirstTab[i]].state === false) {
          valid = false
          this.$refs.TravelWizard.subtitle = 'Please properly fill out all the fields.'
        }
      }
      return valid
    },
    validateSecondTab: function() {
      // check all the fields in the second tab to see that they are properly validated. This will require looping through the travelmodel.travelers and checking each one
      this.$refs.TravelWizard.subtitle = ''
      let valid = true
      let a = document.getElementById('TravelersTable')
      // let b = a.getElementsByTagName('input')
      a.querySelectorAll('input').forEach(function(el) {
        if (!el.classList.contains('is-valid')) {
          valid = false
          vm.$refs.TravelWizard.subtitle = 'Please properly fill out all the fields.'
        }
      })
      return valid
    },
    validateThirdTab: function() {
      // check all the fields in the first tab to see that they are properly validated
      this.$refs.TravelWizard.subtitle = ''
      let valid = true
      for (let i = 0; i < this.fieldsThirdTab.length; i++) {
        /* console.log(this.fieldsThirdTab[i] + ', ' + this.$refs[this.fieldsThirdTab[i]].state) */
        if (this.fieldsThirdTab[i] !== 'Clearance') {
          if (this.$refs[this.fieldsThirdTab[i]].state === false) {
            valid = false
            this.$refs.TravelWizard.subtitle = 'Please properly fill out all the fields.'
          }
        } else {
          let req = this.travelmodel.VisitRequest
          let val = this.travelmodel.Clearance
          if (req === 'yes' && val === 'Select') {
            valid = false
            this.$refs.TravelWizard.subtitle = 'Please properly fill out all the fields.'
          }
        }
      }
      if (valid) {
        this.formValid = true
      }
      return valid
    },
    formatme(d, type) {
      if (!moment(d).isValid()) {
        var result = ''
        if (d === '' || d === undefined) {
          result = 'No Date'
        } else {
          result = 'Invalid Date'
        }
        return result
      } else {
        let f = ''
        switch (type) {
          case 'native':
            f = moment(d).format('YYYY-MM-DD')
            break

          default:
            f = moment(d).format('MM/DD/YYYY')
            break
        }
        return f
      }
    },
    addTravel(d) {
      this.currentmode = 'default' // Reset for change checking
      this.selectedDate = this.formatme(d, 'native')
      this.travelmodel.start = this.selectedDate
      this.$bvModal.show('modal-prompt')
    },
    VisitRequest(checked) {
      this.travelmodel.VisitRequest = checked ? true : false
    },
    btnAddClick: function() {
      this.travelmodel.Travelers.push({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      })
    }
  },
  watch: {
    $route(to, from) {
      this.mode = to.params.mode
      console.log('Mode changes from Calendar.vue: ' + this.currentmode + ', ' + this.mode)
      /* switch (this.mode) {
        case 'new':
          if (this.currentmode !== 'new') {
            this.addTravel(moment())
          }
          break
      } */
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@fullcalendar/list/main.css';
@import '~@fullcalendar/bootstrap/main.css';
@import '~vue-form-wizard/dist/vue-form-wizard.min.css';

table {
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid black !important;
}

#Calendar .titlebar {
  width: 100%;
  font-size: 18px;
  margin: 5px 0;
  text-indent: 10px;
  background-color: black !important;
}
#Calendar {
  margin-top: 10px;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 12px;
}
#Calendar .title {
  line-height: normal;
  color: #ffffff;
  margin-left: 10px;
  margin-top: 10px;
}

.calendar {
  margin: 5px auto;
}
</style>
