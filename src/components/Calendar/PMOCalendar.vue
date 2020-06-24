<template>
  <b-container fluid class="p-0 contentHeight" id="Calendar">
    <b-modal id="modal-wizard" size="xl" centered hide-footer hide-header @hide="onModalHide">
      <b-container fluid class="p-0">
        <div class="row" v-if="tabInvalid">
          <b-alert variant="danger">{{ InvalidMessage }}</b-alert>
        </div>
        <div class="row m-0">
          <div class="col-12 p-0">
            <b-card no-body>
              <b-form>
                <div class="row">
                  <div class="col-3">Title</div>
                  <div class="col-9"><b-form-input class="form-control-sm form-control-event" v-model="eventmodel.Subject"></b-form-input></div>
                </div>
                <div class="row">
                  <div class="col-3">Location</div>
                  <div class="col-9"><b-form-input class="form-control-sm form-control-event" v-model="eventmodel.Location"></b-form-input></div>
                </div>
                <div class="row">
                  <div class="col-3">Start Time</div>
                  <div class="col-9"><b-form-input class="form-control-sm form-control-event" v-model="eventmodel.Location"></b-form-input></div>
                </div>
                <div class="row">
                  <div class="col-3">End Time</div>
                  <div class="col-9"><b-form-input class="form-control-sm form-control-event" v-model="eventmodel.Location"></b-form-input></div>
                </div>
                <div class="row">
                  <div class="col-3">End Time</div>
                  <div class="col-9"><b-form-input class="form-control-sm form-control-event" v-model="eventmodel.Location"></b-form-input></div>
                </div>
                <div class="row">
                  <div class="col-3">Category</div>
                  <div class="col-9"><b-form-input class="form-control-sm form-control-event" v-model="eventmodel.Location"></b-form-input></div>
                </div>
              </b-form>
            </b-card>
          </div>
        </div>
        <div class="row mt-1">
          <div class="col-12 p-0 text-center">
            <b-button-group class="mt-2">
              <b-button variant="danger" ref="btnCancel" class="mr-2" @click="onModalCancel">Cancel</b-button>
              <b-button variant="success" ref="btnOk" class="ml-2" @click="onModalSave">Submit</b-button>
            </b-button-group>
          </div>
        </div>
      </b-container>
    </b-modal>
    <div class="row">
      <ejs-schedule
        id="EventCalendar"
        ref="EventCalendar"
        cssClass="contentHeight"
        :enablePersistence="true"
        :eventSettings="eventSettings"
        :selectedDate="defaultDate"
        :views="views"
        :currentView="currentView"
        :eventRendered="onEventRendered"
        :dragStop="onDragStop"
        :resizeStop="onResizeStop"
        :eventClick="onEventClick"
        :moreEventsClick="onMoreEventsClick"
        :popupOpen="onPopupOpen"
        :cellClick="onCellClick"
        :select="onSelect"
        :actionBegin="onActionBegin"
        :actionComplete="onActionComplete"
      >
        <e-views>
          <e-view option="Day"></e-view>
          <e-view option="Week" :showWeekend="showWeekend"></e-view>
          <e-view option="Month" :showWeekend="showWeekend"></e-view>
        </e-views>
      </ejs-schedule>
    </div>
  </b-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import moment from 'moment'
import axios from 'axios'
import { SchedulePlugin, Day, Week, Month } from '@syncfusion/ej2-vue-schedule'
import { GridPlugin, Page, Sort, Filter, Edit, Resize, Reorder, ColumnMenu, ContextMenu, Toolbar, VirtualScroll } from '@syncfusion/ej2-vue-grids'
import { UploaderPlugin } from '@syncfusion/ej2-vue-inputs'
import User from '@/models/User'
import Event from '@/models/Event'
import { isNullOrUndefined } from 'util'

Vue.use(SchedulePlugin)
Vue.use(GridPlugin)
Vue.use(UploaderPlugin)

var vm = null // setup a global instance pointer to the vue component. This is set in mounted

let data = []

// eslint-disable-next-line no-undef

export default {
  name: 'Calendar',
  props: {
    mode: String
  },
  computed: {
    eventsloaded() {
      return Event.getters('loaded')
    },
    events() {
      return Event.getters('allEvents')
    },
    currentuser() {
      return User.getters('CurrentUser')
    },
    digest() {
      return Event.getters('digest')
    }
  },
  provide: {
    // schedule: [Day, Week, Month, Resize, DragAndDrop],
    schedule: [Day, Week, Month],
    grid: [Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, ContextMenu]
  },
  data: function() {
    return {
      showWeekend: false,
      moreevents: false,
      formdigest: null,
      InvalidMessage: 'Not all fields are filled out correctly.',
      pageSettings: { pageSize: 30 },
      editSettings: {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: false,
        mode: 'Dialog'
      },
      currentmode: 'default',
      height: '100%',
      selectedDate: null,
      defaultDate: new Date(),
      currentView: 'Month',
      views: ['Day', 'Week', 'Month'],
      eventSettings: {
        dataSource: data
      },
      headerBgVariant: 'warning',
      eventmodel: {
        id: 0,
        Subject: '',
        StartTime: '',
        EndTime: '',
        Location: '',
        Category: '',
        etag: '',
        uri: ''
      },
      selectedevent: {},
      formValid: false
    }
  },
  mounted: function() {
    vm = this
    Event.dispatch('getDigest')
    Event.dispatch('getDigest').then(function() {
      vm.$options.interval = setInterval(vm.waitForDigest, 1000)
    })
    /* console.log('DIGEST RETRIEVED: ' + response)
      Event.dispatch('getCamlEvents').then(function() {
        vm.$options.interval = setInterval(vm.waitForEvents, 1000)
      })
    }) */
  },
  methods: {
    getFormDigest() {
      return axios.request({
        // eslint-disable-next-line no-undef
        url: _spPageContextInfo.webServerRelativeUrl + '/_api/contextinfo', // _spPageContextInfo is a SharePoint variable that will exist on the SharePoint page so it is not defined.
        method: 'post',
        headers: { Accept: 'application/json; odata=verbose' }
      })
    },
    getID: function(text, id) {
      return text + '_' + id
    },
    waitForDigest: function() {
      if (this.digest && this.digest.length > 0) {
        clearInterval(this.$options.interval)
        Event.dispatch('getEvents').then(function() {
          vm.$options.interval = setInterval(vm.waitForEvents, 1000)
        })
      }
    },
    waitForEvents: function() {
      if (this.events && this.events.length > 0) {
        clearInterval(this.$options.interval)
        let oldevents = this.$refs.EventCalendar.getEvents()
        this.$refs.EventCalendar.deleteEvent(oldevents)
        this.$refs.EventCalendar.addEvent(this.events)
        // what are we here for? default view? Or are we here to edit/update event requests
        document.getElementById('PageTitle').innerHTML = ' -  Calendar'
      }
    },
    resetEventModel: function() {
      // reset eventmodel
      this.eventmodel = {
        id: 0,
        Subject: '',
        StartTime: '',
        EndTime: '',
        Location: '',
        Category: '',
        etag: '',
        uri: ''
      }
    },
    onModalHide: function(evt) {
      this.editing = false
      vm.resetEventModel()
      if (this.mode == 'default') {
        Event.dispatch('getTRIPS').then(function() {
          vm.$options.interval = setInterval(vm.waitForEvents, 1000)
        })
      } else {
        vm.$router.push({ name: 'Event Calendar', params: { mode: 'default' } })
      }
    },
    onModalCancel: function(evt) {
      this.$bvModal.hide('modal-wizard')
    },
    onModalSave: function() {
      // Now use the information in the eventmodel and eventerData elements to add the event to the calendar and also to the SharePoint list
      let event = []
      let start = moment(this.eventmodel.StartTime).format('YYYY-MM-DD[T]HH:MM:[00Z]')
      let end = moment(this.eventmodel.EndTime).format('YYYY-MM-DD[T]HH:MM:[00Z]')
      event.push({
        Subject: this.eventmodel.Subject,
        StartTime: start,
        EndTime: end,
        Location: this.eventmodel.Location,
        Category: this.eventmodel.Category,
        etag: this.eventmodel.etag,
        uri: this.eventmodel.uri
      })
      this.selectedtrip = event
      if (this.editing) {
        Event.dispatch('editTrip', event).then(function() {
          vm.$bvModal.hide('modal-wizard')
        })
      } else {
        this.$refs.EventCalendar.addEvent(event)
        // now push this to the data model to save to sharepoint
        Event.dispatch('addTrip', event).then(function(response) {
          // the id of the added item is now in the response object!
          let id = response.data.d.Id
          vm.resetEventModel()
          vm.$bvModal.hide('modal-wizard')
        })
      }
    },
    onCellClick: function(args) {
      args.cancel = true
      if (this.moreevents) {
        // do nothing here
        this.moreevents = false
      } else {
        this.eventmodel.StartTime = moment(args.StartTime).format('YYYY-MM-DD')
        this.eventmodel.EndTime = moment(args.EndTime).format('YYYY-MM-DD')
        this.$bvModal.show('modal-wizard')
      }
    },
    onSelect: function(args) {
      args.cancel = true
      if (args.requestType === 'cellSelect') {
        this.eventmodel.StartTime = moment(args.data.StartTime).format('YYYY-MM-DD')
        this.eventmodel.EndTime = moment(args.data.EndTime).format('YYYY-MM-DD')
        this.$bvModal.show('modal-wizard')
      }
    },
    onEventRendered: function(args) {
      let c = args.data.class
      if (!args.element || !c) {
        return
      }
      // remove any existing classes then add the new class
      args.element.classList.remove('checkpoints')
      args.element.classList.remove('milestones')
      args.element.classList.remove('predecessor')
      args.element.classList.remove('pto')
      args.element.classList.remove('recurring')
      args.element.classList.remove('tdy')
      args.element.classList.remove('edefault')
      args.element.classList.add(c)
    },
    onEventClick(args) {
      args.cancel = true
      if (this.moreevents) {
        this.moreevents = false
      } else {
        this.editing = true
        this.fileSelected = !isNullOrUndefined(args.event.TripReport) ? args.event.TripReport : ''
        let giraffe = JSON.parse(args.event.Eventers)
        this.eventmodel.id = args.event.id
        this.eventmodel.Subject = args.event.Subject
        this.eventmodel.Location = args.event.Location
        this.eventmodel.Category = args.event.Category
        this.eventmodel.StartTime = moment(args.event.StartTime)
          //.add(8, 'hours')
          .format('YYYY-MM-DD')
        this.eventmodel.EndTime = moment(args.event.EndTime)
          //.add(8, 'hours')
          .format('YYYY-MM-DD')
        this.eventmodel.etag = args.event.etag
        this.eventmodel.uri = args.event.uri
        this.$bvModal.show('modal-wizard')
      }
    },
    onMoreEventsClick: function(args) {
      this.moreevents = true
    },
    /* onPopupOpen: function(args) {
      console.log('POPUP OPENED: ' + args)
    },
    onDragStop: function(args) {
      args.cancel = true
      console.log('DRAG STOPPED: ' + args)
    },
    onResizeStop: function(args) {
      args.cancel = true
      console.log('RESIZED: ' + args)
    }, */
    getRef(text, idx) {
      return text + '_' + idx
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
    }
  }
}
</script>

<style lang="scss">
.e-time {
  display: none !important;
}

.table td,
.table th {
  padding: 0.1rem !important;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.summarytable {
  font-size: 0.8rem !important;
  width: 100%;
}

#Calendar .titlebar {
  width: 100%;
  font-size: 18px;
  margin: 5px 0;
  text-indent: 10px;
  background-color: black !important;
}
#Calendar {
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

.form-control-event {
  padding: 2px !important;
  font-size: 0.75rem !important;
  height: 20px !important;
}
</style>
