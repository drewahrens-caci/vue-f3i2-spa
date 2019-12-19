<template>
  <b-container fluid class="p-0" id="Calendar">
    <b-modal id="modal-prompt" hide-footer>
      <template v-slot:modal-title> Add Event For {{ selectedDate }} </template>
      <b-button class="mt-3" variant="danger" @click="$bvModal.hide('modal-prompt')">No</b-button>&nbsp;
      <b-button class="mt-3" variant="success" @click="addEvent">Yes</b-button>
    </b-modal>
    <b-modal id="modal-wizard" size="lg" centered hide-footer>
      <template v-slot:modal-title> Add Event For {{ selectedDate }} </template>
      <div class="d-block text-center">
        <form-wizard title="" subtitle="" color="#dd11dd" error-color="#ff0000">
          <tab-content title="Personal details" icon="ti-user" :before-change="validateFirstTab">
            <vue-form-generator :model="model" :schema="firstTabSchema" :options="formOptions" ref="firstTabForm"> </vue-form-generator>
          </tab-content>
          <tab-content title="Traveler details" icon="ti-user">
            <b-row class="scrollable-row">
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
                      <b-form-input class="form-control-xs" v-model="shownData[data.index].firstName" v-bind:id="getID('firstName', data.index)" title="First Name"></b-form-input>
                    </template>
                    <template v-slot:cell(lastName)="data">
                      <b-form-input class="form-control-xs" v-model="shownData[data.index].lastName" v-bind:id="getID('lastName', data.index)" title="Last Name"></b-form-input>
                    </template>
                    <template v-slot:cell(email)="data">
                      <b-form-input class="form-control-xs" v-model="shownData[data.index].email" v-bind:id="getID('email', data.index)" title="Email"></b-form-input>
                    </template>
                    <template v-slot:cell(phone)="data">
                      <b-form-input class="form-control-xs" v-model="shownData[data.index].phone" v-bind:id="getID('phone', data.index)" title="Phone"></b-form-input>
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
          <tab-content title="Additional Info" icon="ti-settings" :before-change="validateSecondTab">
            <vue-form-generator :model="model" :schema="secondTabSchema" :options="formOptions" ref="secondTabForm"> </vue-form-generator>
          </tab-content>
          <tab-content title="Last step" icon="ti-check">
            <h4>Your form is ready!</h4>
          </tab-content>
        </form-wizard>
      </div>
      <!-- <b-button class="mt-3" variant="danger" block @click="$bvModal.hide('modal-prompt')">Cancel</b-button>
      <b-button class="mt-3" variant="success" block @click="addEvent">Ok</b-button> -->
    </b-modal>
    <b-row>
      <div class="mx-auto titlebar">
        <h4 class="title">Scheduled Travel</h4>
      </div>
    </b-row>
    <b-row>
      <FullCalendar
        class="calendar"
        ref="fullCalendar"
        defaultView="dayGridMonth"
        themeSystem="bootstrap"
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
import VueFormGenerator from 'vue-form-generator'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listViewPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'

Vue.use(VueFormGenerator)

var v = null // setup a global instance pointer to the vue component. This is set in mounted

export default {
  name: 'Calendar',
  props: {
    events: Array
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
      model: {
        firstName: '',
        lastName: '',
        email: '',
        streetName: '',
        streetNumber: '',
        city: '',
        country: ''
      },
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
      firstTabSchema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'First name',
            model: 'firstName',
            required: true,
            validator: 'string',
            styleClasses: 'col-xs-6'
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Last name',
            model: 'lastName',
            required: true,
            validator: 'string',
            styleClasses: 'col-xs-6'
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Email',
            model: 'email',
            required: true,
            validator: 'email',
            styleClasses: 'col-xs-12'
          }
        ]
      },
      secondTabSchema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Street name',
            model: 'streetName',
            required: true,
            validator: 'string',
            styleClasses: 'col-xs-9'
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'Street number',
            model: 'streetNumber',
            required: true,
            validator: 'string',
            styleClasses: 'col-xs-3'
          },
          {
            type: 'input',
            inputType: 'text',
            label: 'City',
            model: 'city',
            required: true,
            validator: 'string',
            styleClasses: 'col-xs-6'
          },
          {
            type: 'select',
            label: 'Country',
            model: 'country',
            required: true,
            validator: 'string',
            values: ['United States', 'Romania', 'Germany'],
            styleClasses: 'col-xs-6'
          }
        ]
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
        { key: 'firstName', label: 'First Name', thClass: 'text-center px40', sortable: true },
        { key: 'lastName', label: 'Last Name', thClass: 'text-center px40', sortable: true },
        { key: 'email', label: 'Email', thClass: 'text-center px90' },
        { key: 'phone', label: 'Phone', thClass: 'text-center px60' }
      ],
      shownData: []
    }
  },
  created: function() {
    this.calendarEvents = this.events
    /* this.travelers.push({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }) */
  },
  mounted: function() {
    v = this
  },
  methods: {
    /* toggleWeekends() {
      this.calendarWeekends = !this.calendarWeekends // update a property
    },
    gotoPast() {
      let calendarApi = this.$refs.fullCalendar.getApi() // from the ref="..."
      calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
    }, */
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
    validateFirstTab: function() {
      return this.$refs.firstTabForm.validate()
    },
    validateSecondTab: function() {
      return this.$refs.secondTabForm.validate()
    },
    formatme(d) {
      if (!moment(d).isValid()) {
        var result = ''
        if (d === '' || d === undefined) {
          result = 'No Date'
        } else {
          result = 'Invalid Date'
        }
        return result
      } else {
        return moment(d).format('MM/DD/YYYY')
      }
    },
    handleDateClick(arg) {
      // Ask the user if they want to create an event. If yes, start the add event wizard.
      this.selectedDate = this.formatme(arg.date)
      this.$bvModal.show('modal-prompt')
    },
    addEvent: function() {
      this.$bvModal.hide('modal-prompt')
      this.$bvModal.show('modal-wizard')
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
