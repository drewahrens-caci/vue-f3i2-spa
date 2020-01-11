<template>
  <b-container fluid class="p-0" id="Calendar">
    <b-modal id="modal-prompt" centered hide-footer>
      <template v-slot:modal-title> Add Event For {{ selectedDate }} </template>
      <b-button class="mt-3 float-right" variant="success" @click="addEvent">Yes</b-button>
      <b-button class="mt-3 float-right" variant="danger" @click="$bvModal.hide('modal-prompt')">No</b-button>&nbsp;
    </b-modal>
    <b-modal id="event-wizard" size="lg" centered hide-footer>
      <template v-slot:modal-title> Add Event For {{ selectedDate }} </template>
      <div class="d-block text-center">
        <b-form>
          <b-row>
            <b-col md="4">Event Title</b-col>
            <b-col md="4">Start Date</b-col>
            <b-col md="4">End Date</b-col>
          </b-row>
          <b-row>
            <b-col md="4"><b-form-input class="form-control-sm form-control-travel" v-model="eventmodel.title"></b-form-input></b-col>
            <b-col md="4"><el-date-picker v-model="eventmodel.start" type="datetime" format="MM/dd/yyyy HH:mm:ss" value-format="MM/dd/yyyy HH:mm:ss" title="Start"></el-date-picker></b-col>
            <b-col md="4"><el-date-picker v-model="eventmodel.end" type="datetime" format="MM/dd/yyyy HH:mm:ss" value-format="MM/dd/yyyy HH:mm:ss" title="End" :state="ValidateMe('end')"></el-date-picker></b-col>
          </b-row>
          <b-row>
            <b-col md="8">Event Details</b-col>
            <b-col md="4">Event Category</b-col>
          </b-row>
          <b-row>
            <b-col md="8"><b-form-input class="form-control-sm form-control-travel" v-model="eventmodel.details"></b-form-input></b-col>
            <b-col md="4"><b-form-select class="form-control-sm form-control-travel" v-model="eventmodel.category" :options="eventcategories"></b-form-select></b-col>
          </b-row>
        </b-form>
      </div>
    </b-modal>
    <b-modal id="modal-wizard" size="lg" centered hide-footer>
      <template v-slot:modal-title> Add Event For {{ selectedDate }} </template>
      <div class="d-block text-center">
        <form-wizard title="New Travel Request" subtitle="" color="#fd7e14" error-color="#ff0000" shape="tab" @on-complete="onComplete" ref="travelwizard">
          <tab-content title="Travel Information" icon="ti-user" :before-change="validateFirstTab">
            <b-form>
              <b-row>
                <b-col md="6">Company</b-col>
                <b-col md="6">WorkPlan</b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.company" :state="ValidateMe('company')" ref="company"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter at least 3 letters
                  </b-form-invalid-feedback>
                </b-col>
                <b-col md="6">
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.workplan" :state="ValidateMe('workplan')" ref="workplan"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter in YY-XXXX format (Proper workplan format)
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">Start Date</b-col>
                <b-col md="6">End Date</b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-input v-model="travelmodel.start" ref="start" type="date" title="Start" :state="ValidateMe('start')"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter a valid date (mm/dd/yyyy)
                  </b-form-invalid-feedback>
                </b-col>
                <b-col md="6">
                  <b-form-input v-model="travelmodel.end" ref="end" type="date" title="End" :state="ValidateMe('end')"></b-form-input>
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
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.from" :state="ValidateMe('from')" ref="from"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter at least 5 letters
                  </b-form-invalid-feedback>
                </b-col>
                <b-col md="6">
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.to" :state="ValidateMe('to')" ref="to"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter at least 5 letters
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form>
          </tab-content>
          <tab-content title="Traveler details" icon="ti-user" :before-change="validateSecondTab">
            <b-row>
              <b-col cols="12" class="px-0">
                <b-form>
                  <b-table id="TravelersTable" ref="TravelersTable" v-model="shownData" responsive :tbody-tr-class="rowClass" :striped="striped" :bordered="bordered" :small="small" :hover="hover" :items="travelers" :fields="fields" style="table-layout: fixed;">
                    <!-- <template slot="actions" slot-scope="row">
                      <b-button
                        size="sm"
                        variant="outline"
                        v-bind:id="getID('DELETE_', shownData[row.index].guid)"
                        class="actionbutton trashred"
                        v-bind:class="{ whiteButton: shownData[row.index].delete === 'Y', redButton: shownData[row.index].delete === 'N' }"
                        @click="deleteme(shownData[row.index].guid, shownData[row.index].delete)"
                      >
                        <font-awesome-icon far icon="trash-alt"></font-awesome-icon>
                      </b-button>
                      <b-button size="sm" variant="outline" class="actionbutton" @click="row.toggleDetails">
                        <font-awesome-icon v-if="row.detailsShowing" far class="ml-1" icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                        <font-awesome-icon v-else-if="shownData[row.index].comms !== ''" far class="ml-1" icon="plus-square" :style="{ color: 'green' }"></font-awesome-icon>
                        <font-awesome-icon v-else far class="ml-1" icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
                      </b-button>
                    </template> -->
                    <template v-slot:cell(firstName)="data">
                      <b-form-input class="form-control-sm" v-model="shownData[data.index].firstName" title="First Name" :state="validateLength(shownData[data.index].firstName, 1)"></b-form-input>
                      <b-form-invalid-feedback>
                        Enter at least 2 letters
                      </b-form-invalid-feedback>
                    </template>
                    <template v-slot:cell(lastName)="data">
                      <b-form-input class="form-control-sm" v-model="shownData[data.index].lastName" title="Last Name" :state="validateLength(shownData[data.index].lastName, 1)"></b-form-input>
                      <b-form-invalid-feedback>
                        Enter at least 2 letters
                      </b-form-invalid-feedback>
                    </template>
                    <template v-slot:cell(email)="data">
                      <b-form-input class="form-control-sm" v-model="shownData[data.index].email" title="Email" :state="validateEmail(shownData[data.index].email)"></b-form-input>
                      <b-form-invalid-feedback>
                        Enter a proper email address
                      </b-form-invalid-feedback>
                    </template>
                    <template v-slot:cell(phone)="data">
                      <b-form-input class="form-control-sm" v-model="shownData[data.index].phone" title="Phone" :state="validatePhone(shownData[data.index].phone)"></b-form-input>
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
          <tab-content title="Additional Info" icon="ti-settings" :before-change="validateThirdTab">
            <b-form>
              <b-row>
                <b-col md="6">Gov Sponsor</b-col>
                <b-col md="6">Estimated Cost</b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.sponsor" ref="sponsor" :state="ValidateMe('sponsor')"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter at least 5 letters
                  </b-form-invalid-feedback>
                </b-col>
                <b-col md="6">
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.cost" ref="cost" :state="ValidateMe('cost')"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter at least 5 letters
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
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.poc.name" ref="pocname" :state="ValidateMe('pocname')"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter at least 5 letters
                  </b-form-invalid-feedback>
                </b-col>
                <b-col md="4">
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.poc.email" ref="pocemail" :state="ValidateMe('pocemail')"></b-form-input>
                  <b-form-invalid-feedback>
                    Enter a proper email address
                  </b-form-invalid-feedback>
                </b-col>
                <b-col md="4">
                  <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.poc.phone" ref="pocphone" :state="ValidateMe('pocphone')"></b-form-input>
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
                  <b-form-textarea class="form-control-sm form-control-travel" v-model="travelmodel.purpose" placeholder="Purpose of this trip..." rows="3" max-rows="6" ref="purpose" :state="ValidateMe('purpose')"></b-form-textarea>
                  <b-form-invalid-feedback>
                    Enter at least 5 letters
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12"><b-form-checkbox class="form-control-sm" v-model="travelmodel.request" name="checkbox-1" value="yes" unchecked-value="no" ref="request">Visit Request Required</b-form-checkbox></b-col>
              </b-row>
              <b-row v-if="travelmodel.request === 'yes'">
                <b-col md="12">
                  <b-form-select class="form-control-sm" v-model="travelmodel.clearance" :options="levels" ref="clearance" :state="ValidateMe('clearance')"></b-form-select>
                  <b-form-invalid-feedback>
                    Please select a valid option
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form>
          </tab-content>
          <tab-content title="Last step" icon="ti-check">
            <h4>Your form is ready!</h4>
          </tab-content>
        </form-wizard>
      </div>
    </b-modal>
    <b-row>
      <div class="titlebar">
        <span class="title">{{ title }}</span>
      </div>
    </b-row>
    <b-row>
      <FullCalendar
        class="calendar"
        ref="fullCalendar"
        defaultView="dayGridMonth"
        themeSystem="bootstrap"
        :bootstrapFontAwesome="{
          close: 'fa-times',
          prev: 'fa-chevron-left',
          next: 'fa-chevron-right',
          prevYear: 'fa-angle-double-left',
          nextYear: 'fa-angle-double-right'
        }"
        :height="750"
        :header="{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }"
        :plugins="calendarPlugins"
        :weekends="calendarWeekends"
        :events="events"
        :fixedWeekCount="fixedWeekCount"
        @dateClick="handleDateClick"
      />
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { FormWizard, TabContent } from 'vue-form-wizard'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listViewPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'

var v = null // setup a global instance pointer to the vue component. This is set in mounted

export default {
  name: 'Calendar',
  props: {
    events: Array,
    title: String,
    type: String
  },
  components: {
    FullCalendar,
    FormWizard,
    TabContent
  },
  data: function() {
    return {
      calendarPlugins: [bootstrapPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin],
      calendarWeekends: true,
      fixedWeekCount: false,
      calendarEvents: [],
      selectedDate: '',
      eventcategories: [
        { value: 'Holiday', text: 'Holiday' },
        { value: 'Leave', text: 'Leave' },
        { value: 'Training', text: 'Training' },
        { value: 'Meeting', text: 'Meeting' },
        { value: 'Home', text: 'Working From Home' }
      ],
      eventmodel: {
        id: 0,
        title: '',
        category: '',
        details: '',
        start: '',
        end: '',
        user: '',
        allday: false
      },
      travelmodel: {
        id: 0,
        workplan: '',
        company: '',
        start: '',
        end: '',
        from: '',
        to: '',
        travelers: '',
        sponsor: '',
        poc: {
          name: '',
          email: '',
          phone: ''
        },
        purpose: '',
        clearance: 'Select',
        request: false,
        cost: '',
        index: ''
      },
      fieldsFirstTab: ['workplan', 'company', 'start', 'end', 'from', 'to'],
      fieldsThirdTab: ['sponsor', 'pocname', 'pocemail', 'pocphone', 'purpose', 'clearance', 'cost'],
      travelers: [
        {
          firstName: 'first',
          lastName: 'last',
          email: 'email',
          phone: 'phone'
        }
      ],
      formOptions: {
        validationErrorClass: 'has-error',
        validationSuccessClass: 'has-success',
        validateAfterChanged: true
      },
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
        { key: 'lastName', label: 'Last Name', thClass: 'text-center px80', sortable: true },
        { key: 'email', label: 'Email', thClass: 'text-center px200' },
        { key: 'phone', label: 'Phone', thClass: 'text-center px100' }
      ],
      levels: [
        { value: 'Select', text: 'Select' },
        { value: 'S', text: 'S' },
        { value: 'TS', text: 'TS' },
        { value: 'TSSCI', text: 'TS/SCI' }
      ],
      shownData: []
    }
  },
  created: function() {
    this.calendarEvents = this.events
  },
  mounted: function() {
    v = this
  },
  methods: {
    getID: function(text, id) {
      return text + '_' + id
    },
    rowClass(item, type) {
      if (!item) return
      if (item.delete === 'Y') return 'table-delete'
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max))
    },
    getRef(id) {
      return 'traveler_' + id
    },
    onComplete: function() {
      alert('Yay. Done!')
    },
    ValidateMe: function(control) {
      let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
      let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      let ret = false
      switch (control) {
        case 'company':
          ret = this.travelmodel.company.length > 2 ? true : false
          break

        case 'workplan':
          ret = this.travelmodel.workplan.length > 6 ? true : false
          break

        case 'start':
          ret = moment(this.travelmodel.start).isValid() ? true : false
          break

        case 'end':
          ret = moment(this.travelmodel.end).isValid() ? true : false
          break

        case 'from':
          ret = this.travelmodel.from.length > 4 ? true : false
          break

        case 'to':
          ret = this.travelmodel.to.length > 4 ? true : false
          break

        case 'sponsor':
          ret = this.travelmodel.sponsor.length > 4 ? true : false
          break

        case 'cost':
          ret = this.travelmodel.cost.length > 4 ? true : false
          break

        case 'pocname':
          ret = this.travelmodel.poc.name.length > 4 ? true : false
          break

        case 'pocemail':
          ret = emailPattern.test(this.travelmodel.poc.email) ? true : false
          break

        case 'pocphone':
          ret = phoneNumberPattern.test(this.travelmodel.poc.phone) ? true : false
          break

        case 'purpose':
          ret = this.travelmodel.purpose.length > 4 ? true : false
          break

        case 'clearance':
          let req = this.travelmodel.request
          let val = this.travelmodel.clearance
          let good = false
          if (req === 'yes' && val !== 'Select') {
            good = true
          }
          ret = good
          break
      }
      return ret
    },
    validateLength: function(value, length) {
      return value.length > length
    },
    validateEmail: function(email) {
      let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return emailPattern.test(email)
    },
    validatePhone: function(phone) {
      let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
      return phoneNumberPattern.test(phone)
    },
    validateFirstTab: function() {
      // check all the fields in the first tab to see that they are properly validated
      this.$refs.travelwizard.subtitle = ''
      let valid = true
      for (let i = 0; i < this.fieldsFirstTab.length; i++) {
        console.log(this.fieldsFirstTab[i] + ', ' + this.$refs[this.fieldsFirstTab[i]].state)
        if (this.$refs[this.fieldsFirstTab[i]].state === false) {
          valid = false
          this.$refs.travelwizard.subtitle = 'Please properly fill out all the fields.'
        }
      }
      return valid
    },
    validateSecondTab: function() {
      // check all the fields in the first tab to see that they are properly validated. This will require looping through the travlers model and checking each one
      this.$refs.travelwizard.subtitle = ''
      let valid = true

      return valid
    },
    validateThirdTab: function() {
      // check all the fields in the first tab to see that they are properly validated
      this.$refs.travelwizard.subtitle = ''
      let valid = true
      for (let i = 0; i < this.fieldsThirdTab.length; i++) {
        /* console.log(this.fieldsThirdTab[i] + ', ' + this.$refs[this.fieldsThirdTab[i]].state) */
        if (this.fieldsThirdTab[i] !== 'clearance') {
          if (this.$refs[this.fieldsThirdTab[i]].state === false) {
            valid = false
            this.$refs.travelwizard.subtitle = 'Please properly fill out all the fields.'
          }
        } else {
          let req = this.travelmodel.request
          let val = this.travelmodel.clearance
          if (req === 'yes' && val === 'Select') {
            valid = false
            this.$refs.travelwizard.subtitle = 'Please properly fill out all the fields.'
          }
        }
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
    handleDateClick(arg) {
      // Ask the user if they want to create an event. If yes, start the add event wizard.
      this.selectedDate = this.formatme(arg.date, 'native')
      this.travelmodel.start = this.selectedDate
      this.$bvModal.show('modal-prompt')
    },
    addEvent: function() {
      this.$bvModal.hide('modal-prompt')
      switch (this.type) {
        case 'travel':
          this.$bvModal.show('modal-wizard')
          break

        case 'event':
          this.$bvModal.show('event-wizard')
      }
    },
    visitrequest(checked) {
      this.travelmodel.request = checked ? true : false
    },
    btnAddClick: function() {
      this.travelers.push({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      })
    }
  }
}
</script>

<style lang="scss">
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@fullcalendar/list/main.css';
@import '~@fullcalendar/bootstrap/main.css';
@import '~vue-form-wizard/dist/vue-form-wizard.min.css';

.titlebar {
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
