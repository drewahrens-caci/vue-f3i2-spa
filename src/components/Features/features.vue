<!-- eslint-disable -->
<template>
  <b-container fluid class="contentHeight featuresmain">
    <b-row ref="GridRow" class="contentHeight">
      <b-modal ref="FilterModal" id="FilterModal" size="sm" no-fade modal-class="animated bounceInLeft">
        <template v-slot:modal-title>Feature Filter</template>
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
                        <ejs-dropdownlist v-if="field.DropdownSource === 'status'" v-model="field.Selected" :dataSource="status" :fields="ddfields"></ejs-dropdownlist>
                        <ejs-dropdownlist v-else-if="field.DropdownSource === 'category'" v-model="field.Selected" :dataSource="category" :fields="ddfields"></ejs-dropdownlist>
                        <ejs-dropdownlist v-else-if="field.DropdownSource === 'owners'" v-model="field.Selected" :dataSource="owners" :fields="ddfields"></ejs-dropdownlist>
                      </div>
                      <div v-else class="full">
                        <ejs-dropdownlist v-if="field.DropdownSource === 'priority'" v-model="field.FilterValue" :dataSource="priority" :fields="ddfields"></ejs-dropdownlist>
                        <ejs-dropdownlist v-else-if="field.DropdownSource === 'effort'" v-model="field.FilterValue" :dataSource="effort" :fields="ddfields"></ejs-dropdownlist>
                        <ejs-dropdownlist v-else-if="field.DropdownSource === 'percent'" v-model="field.FilterValue" :dataSource="percent" :fields="ddfields"></ejs-dropdownlist>
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
              id="FeatureGrid"
              ref="FeatureGrid"
              :enablePersistence="false"
              :dataSource="filteredfeatures"
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
              :detailTemplate="detailTemplate"
              rowHeight="20"
              height="100%"
              width="100%"
            >
              <e-columns>
                <e-column headerText="Your Rating" textAlign="Left" width="150" :template="RatingsTemplate"></e-column>
                <e-column field="Title" headerText="Title" textAlign="Left" width="200"></e-column>
                <e-column field="Product" headerText="Product" width="100"></e-column>
                <e-column field="Category" headerText="Category" width="100"></e-column>
                <e-column field="DueDate" headerText="Due Date" textAlign="Left" width="100"></e-column>
                <e-column field="Priority" headerText="Priority" textAlign="Left" width="100"></e-column>
                <e-column field="Status" headerText="Status" textAlign="Left" width="180"></e-column>
                <e-column field="Effort" headerText="Effort" textAlign="Left" width="150"></e-column>
                <e-column field="PercentComplete" headerText="% Complete" textAlign="Left" width="150"></e-column>
                <e-column field="Rating" headerText="Rating" textAlign="Left" width="150" :template="CombinedRatingsTemplate"></e-column>
                <e-column field="AssignedTo" headerText="Assigned To" textAlign="Left" width="200"></e-column>
                <e-column field="RatingData" :visible="false" headerText="Rating Data" width="110"></e-column>
              </e-columns>
            </ejs-grid>
          </div>
        </b-row>
      </b-col>
    </b-row>
    <b-modal id="EditModal" ref="EditModal" size="xl" centered @ok="editOk" @shown="onModalShown">
      <template v-slot:modal-title>Edit Details For {{ rowData.Title }}</template>
      <b-container fluid id="EditTable" class="featuretable">
        <b-row>
          <b-col cols="8">Title</b-col>
          <b-col cols="4">Product</b-col>
        </b-row>
        <b-row>
          <b-col cols="8"><input class="e-input" type="text" v-model="rowData.Title" /></b-col>
          <b-col cols="4"><ejs-dropdownlist v-model="rowData.Product" :dataSource="product" :fields="ddfields"></ejs-dropdownlist></b-col>
        </b-row>
        <b-row>
          <b-col cols="4">Status</b-col>
          <b-col cols="4">Priority</b-col>
          <b-col cols="4">Category</b-col>
        </b-row>
        <b-row>
          <b-col cols="4"><ejs-dropdownlist v-model="rowData.Status" :dataSource="status" :fields="ddfields"></ejs-dropdownlist></b-col>
          <b-col cols="4"><ejs-dropdownlist v-model="rowData.Priority" :dataSource="priority" :fields="ddfields"></ejs-dropdownlist></b-col>
          <b-col cols="4"><ejs-dropdownlist v-model="rowData.Category" :dataSource="category" :fields="ddfields"></ejs-dropdownlist></b-col>
        </b-row>
        <b-row>
          <b-col cols="4">Effort</b-col>
          <b-col cols="4">Due Date</b-col>
          <b-col cols="4">% Complete</b-col>
        </b-row>
        <b-row>
          <b-col cols="4"><ejs-dropdownlist v-model="rowData.Effort" :dataSource="effort" :fields="ddfields"></ejs-dropdownlist></b-col>
          <b-col cols="4"><ejs-datepicker v-model="rowData.DueDate"></ejs-datepicker></b-col>
          <b-col cols="4"><ejs-dropdownlist v-model="rowData.PercentComplete" :dataSource="percent" :fields="ddfields"></ejs-dropdownlist></b-col>
        </b-row>
        <b-row>
          <b-col cols="8">Description</b-col>
          <b-col cols="4">Assigned To</b-col>
        </b-row>
        <b-row>
          <b-col cols="8">
            <ejs-richtexteditor ref="Comment" id="rteComment" v-model="rowData.Comment" height="200" :created="onCreate"></ejs-richtexteditor>
          </b-col>
          <b-col cols="4"><ejs-dropdownlist v-model="rowData.AssignedTo" :dataSource="owners" :fields="ddfields"></ejs-dropdownlist></b-col>
        </b-row>
        <b-row>
          <b-col cols="12">Comments</b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <ejs-richtexteditor ref="Comments" id="rteComments" v-model="rowData.Comments" height="300" :created="onCreate"></ejs-richtexteditor>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </b-container>
</template>

<script>
import Vue from 'vue'
import { EventBus } from '../../main'
import Feature from '@/models/Feature'
import User from '@/models/User'
import { Page, Edit, Toolbar, VirtualScroll, ExcelExport, DetailRow } from '@syncfusion/ej2-vue-grids'
import { Toolbar as RTEToolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table } from '@syncfusion/ej2-vue-richtexteditor'

let vm = null

export default {
  name: 'features',
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    features() {
      return Feature.getters('allFeatures')
    },
    owners() {
      return Feature.getters('Owners')
    },
    loaded() {
      return Feature.getters('Loaded')
    },
    appversion() {
      return User.getters('AppVersion')
    },
    user() {
      return User.getters('CurrentUser')
    },
    userid() {
      return User.getters('CurrentUserId')
    }
  },
  data: function() {
    return {
      waterMark: 'Select a date',
      sortfield: '',
      sortdir: '',
      filteredfeatures: [],
      FeatureId: 0,
      rating: 0,
      data: [],
      height: '100%',
      fields: [
        {
          FieldName: 'Version',
          Value: null
        },
        {
          FieldName: 'Title',
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
          FieldName: 'Category',
          Visible: true,
          DisplayName: 'Category',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Choice',
          DropdownSource: 'category',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'DueDate',
          Visible: true,
          DisplayName: 'Due Date',
          Filter: false,
          Control: '',
          DataType: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        },
        {
          FieldName: 'Priority',
          Visible: true,
          DisplayName: 'Priority',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Number',
          DropdownSource: 'priority',
          Selected: 'S',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
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
          Sort: ''
        },
        {
          FieldName: 'Effort',
          Visible: true,
          DisplayName: 'Effort',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Number',
          DropdownSource: 'effort',
          Selected: 'S',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'PercentComplete',
          Visible: true,
          DisplayName: '% Complete',
          Filter: false,
          Control: 'DropdownBox',
          DataType: 'Number',
          DropdownSource: 'percent',
          Selected: 'S',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Rating',
          Visible: true,
          DisplayName: 'Rating',
          Filter: false,
          Control: '',
          DataType: 'Number',
          Predicate: 'S',
          FilterValue: '',
          Sort: 'desc'
        }
      ],
      ddfields: { text: 'text', value: 'value' },
      ddfields2: { text: 'text', value: 'value', data: 'data' },
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
      yesno: [
        { text: 'Yes', value: 'Yes' },
        { text: 'No', value: 'No' }
      ],
      priority: [
        { text: 'Select...', value: 'S' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' }
      ],
      product: [
        { text: 'Select...', value: 'S' },
        { text: 'Portal', value: 'Portal' },
        { text: 'Travel', value: 'Travel' },
        { text: 'Personnel', value: 'Personnel' },
        { text: 'Workplans', value: 'Workplans' },
        { text: 'MSRs', value: 'MSRs' },
        { text: 'Financial', value: 'Financial' },
        { text: 'Features', value: 'Features' },
        { text: 'Bugs', value: 'Bugs' }
      ],
      status: [
        { text: 'Select...', value: 'S' },
        { text: 'Submitted', value: 'Submitted' },
        { text: 'Active', value: 'Active' },
        { text: 'Resolved', value: 'Resolved' },
        { text: 'Closed', value: 'Closed' }
      ],
      effort: [
        { text: 'Select...', value: 'S' },
        { text: '0.5', value: '0.5' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '5', value: '5' },
        { text: '10', value: '10' },
        { text: '15', value: '15' },
        { text: '20', value: '20' },
        { text: '30', value: '30' }
      ],
      percent: [
        { text: 'Select...', value: 'S' },
        { text: '0', value: '0' },
        { text: '10', value: '10' },
        { text: '20', value: '20' },
        { text: '30', value: '30' },
        { text: '40', value: '40' },
        { text: '50', value: '50' },
        { text: '60', value: '60' },
        { text: '70', value: '70' },
        { text: '80', value: '80' },
        { text: '90', value: '90' },
        { text: '100', value: '100' }
      ],
      category: [
        { text: 'Select...', value: 'S' },
        { text: 'Feature', value: 'Feature' },
        { text: 'Story', value: 'Story' }
      ],
      pageSettings: { pageSize: 30 },
      editSettings: { allowEditing: true, allowAdding: false, allowDeleting: false, mode: 'Dialog' },
      sortSettings: { columns: [{ field: 'Rating', direction: 'Descending' }] },
      filterSettings: { type: 'Menu' },
      toolbar: ['Edit', 'Print', 'Search', 'ExcelExport'],
      rowData: {},
      newData: {
        LastName: '',
        FirstName: '',
        Middle: '',
        Company: '',
        Email: ''
      },
      CombinedRatingsTemplate: function() {
        return {
          template: Vue.component('columnTemplate', {
            template: `
            <div>
              <b-form-rating no-border v-model="data.Rating" read-only show-value show-value-max precision="2"></b-form-rating>
            </div>`,
            data: function() {
              return {
                data: {}
              }
            }
          })
        }
      },
      RatingsTemplate: function() {
        return {
          template: Vue.component('columnTemplate', {
            template: `
            <div>
              <b-form-rating no-border v-model="data.UserRating" @change="rateme(data)"></b-form-rating>
            </div>`,
            data: function() {
              return {
                data: {}
              }
            },
            mounted: function() {
              if (this.data.RatingData.length > 5) {
                let rd = JSON.parse(String(this.data.RatingData))
                for (let i = 0; i < rd.length; i++) {
                  if (rd[i].userid == vm.userid) {
                    this.data.UserRating = rd[i].rating
                  }
                }
              }
            },
            methods: {
              rateme: function(data) {
                // console.log('RATE ID: ' + data.Id + vm.userid)
                let drd = String(data.RatingData)
                let rd = []
                if (drd.length < 5) {
                  // no rating yet for this request so just add the current user and their rating to the data.
                  rd.push({
                    userid: vm.userid,
                    rating: data.UserRating
                  })
                } else {
                  // determine if the user has voted and if not add their vote and if so update their vote
                  rd = JSON.parse(drd)
                  let voted = false
                  for (let i = 0; i < rd.length; i++) {
                    if (rd[i].userid == vm.userid) {
                      voted = true
                      rd[i].rating = data.UserRating
                    }
                  }
                  if (!voted) {
                    rd.push({
                      userid: vm.userid,
                      rating: data.UserRating
                    })
                  }
                }
                // now calculate the actual rating by adding all the ratings and dividing by 5
                let sum = 0
                for (let i = 0; i < rd.length; i++) {
                  sum += rd[i].rating
                }
                let r = (sum / rd.length).toFixed(2)
                data.Rating = r
                data.RatingData = rd
                let payload = {}
                payload.etag = data.etag
                payload.uri = data.uri
                payload.id = data.Id
                payload.Rating = data.Rating
                payload.RatingData = JSON.stringify(data.RatingData)
                Feature.dispatch('rate', payload).then(function() {
                  // vm.$router.push({ name: 'Refresh', params: { action: 'features' } })
                  Feature.dispatch('getFeatures').then(function() {
                    vm.$options.interval = setInterval(vm.waitForFeatures, 1000)
                  })
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
    Feature.dispatch('getDigest')
    Feature.dispatch('getOwners').then(function() {
      Feature.dispatch('getFeatures').then(function() {
        vm.$options.interval = setInterval(vm.waitForFeatures, 1000)
      })
    })
  },
  methods: {
    waitForFeatures: function() {
      // console.log('WAITING FOR PERSONNEL')
      if (this.features && this.features.length > 0) {
        clearInterval(this.$options.interval)
        // console.log('PERSONNEL LENGTH: ' + this.feature.length)
        this.filteredfeatures = this.features // set initial filter to all
        // load any saved filters
        this.loadfilters()
        switch (this.mode) {
          case 'default':
            document.getElementById('PageTitle').innerHTML = ' -  Reports'
            break
        }
      }
    },
    getRef: function(text, idx) {
      return text + '_' + idx
    },
    onModalShown() {
      EventBus.$emit('refresh')
    },
    onCreate: function() {
      EventBus.$on('refresh', this.refreshRte)
    },
    refreshRte() {
      this.$refs.Comment.refreshUI()
      this.$refs.Comments.refreshUI()
    },
    toolbarClick: function(args) {
      switch (args.item.id) {
        case 'FeatureGrid_excelexport':
          this.$refs['FeatureGrid'].excelExport()
          break

        case 'FeatureGrid_print':
          this.$refs['FeatureGrid'].print()
          break
      }
    },
    ToggleFilters() {
      this.$refs['FilterModal'].toggle('#ShowFilters')
    },
    onModalHide: function() {
      // console.log('MODAL HIDE: ' + this.mode)
      vm.$router.push({ name: 'Refresh', params: { action: 'feature' } })
    },
    actionBegin(args) {
      // console.log('ACTION BEGIN: ' + args.requestType)
      switch (args.requestType) {
        case 'beginEdit':
          // args.rowData contains the data for the row. Place this data in our edit form and we can change it and then update the row and also SharePoint
          args.cancel = true
          this.FeatureId = args.rowData.Id
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
        this.$refs['FeatureGrid'].autoFitColumns()
      }
      if (args.requestType == 'refresh') {
        let h1 = 0
        let h2 = this.$refs.FeatureGrid.$el.children[7].children[0].clientHeight
        h1 = Math.floor(h2 / 20)
        this.pageSettings.pageSize = h1
        this.$refs.FeatureGrid.pageSettings = { pageSize: h1 }
      }
    },
    dataBound: function() {
      this.$refs.FeatureGrid.autoFitColumns()
    },
    editRow: function(data) {
      this.$bvModal.show('EditModal')
      this.rowData = data
    },
    editOk: function() {
      Feature.dispatch('editFeature', this.rowData).then(function() {
        vm.hideme('EditModal', 'refresh')
      })
    },
    newOk: function() {
      Feature.dispatch('addFeature', this.newData).then(function() {
        vm.hideme('NewModal', 'refresh')
      })
    },
    hideme: function(modal, action) {
      vm.$bvModal.hide(modal)
      if (action == 'refresh') {
        vm.$router.push({ name: 'Refresh', params: { action: 'features' } })
      }
    },
    sortup: function(e, t) {
      // ascending
      var p = this.filteredfeatures
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
      this.filteredfeatures = p
      this.$refs.FeatureGrid.refresh()
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
      var p = this.filteredfeatures
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
      this.filteredfeatures = p
      this.$refs.FeatureGrid.refresh()
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
        this.$refs.FeatureGrid.showColumns([displayname])
        this.$refs.FeatureGrid.autoFitColumns()
      } else {
        this.$refs.FeatureGrid.hideColumns([displayname])
        this.$refs.FeatureGrid.autoFitColumns()
      }
    },
    setfilter: function() {
      // always reset to all records then do all filters as they are selected.
      // this is a top down filter
      // loop through all the fields and filter the ones that have a predicate and filtervalue set
      var p = this.features // set initial filter to all based on the module. feature in this case
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
      vm.filteredfeatures = p
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
      window.localStorage.removeItem('feature')
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
      vm.filteredfeatures = vm.features
      vm.setfilter()
    },
    savefilters: function() {
      this.fields[0].Value = this.appversion
      window.localStorage.setItem('feature', JSON.stringify(this.fields))
    },
    loadfilters: function() {
      let f = String(window.localStorage.getItem('feature'))
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
                    this.$refs.FeatureGrid.showColumns(this.fields[i].DisplayName)
                    this.$refs.FeatureGrid.autoFitColumns()
                  } else {
                    this.$refs.FeatureGrid.hideColumns(this.fields[i].DisplayName)
                    this.$refs.FeatureGrid.autoFitColumns()
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
    grid: [Page, Edit, DetailRow, Toolbar, VirtualScroll, ExcelExport],
    richtexteditor: [RTEToolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table]
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.mode = to.params.mode
      switch (this.mode) {
        case 'default':
          Feature.dispatch('getFeature').then(function() {
            vm.$options.interval = setInterval(vm.waitForFeatures, 1000)
          })
          break
      }
    }
  }
}
</script>

<style lang="scss">
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

.e-richtexteditor .e-rte-content .e-content,
.e-richtexteditor .e-source-content .e-content {
  padding: 10px !important;
}
</style>
