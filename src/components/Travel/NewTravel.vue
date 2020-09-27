<template>
  <div>
    <b-modal id="new-travel-wizard" size="xl" centered hide-footer @close="onModalHide" v-model="Show">
      <template v-slot:modal-title> New Travel Request </template>
      <b-container fluid class="p-0">
        <b-row class="m-0 pl-1" v-if="tabInvalid">
          <b-alert variant="danger" show>{{ InvalidMessage }}</b-alert>
        </b-row>
        <b-row class="m-0 pl-1">
          <div class="col-12 p-0">
            <b-card no-body>
              <b-tabs ref="dashboardtabs" class="tabArea" card v-model="tabIndex" @activate-tab="onTabSelected">
                <b-tab class="mtab" active>
                  <template slot="title"
                    ><font-awesome-icon fas icon="cog" class="icon"></font-awesome-icon>
                    Travel Information
                  </template>
                  <b-form>
                    <div class="row">
                      <div class="col-6">OCONUS</div>
                      <div v-if="travelmodel.InternalData.OCONUSTravel == 'Yes'" class="col-6">OCONUS Location</div>
                      <div v-else class="col-6"></div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <b-form-checkbox v-model="travelmodel.InternalData.OCONUSTravel" value="Yes" unchecked-value="No" switch @change="onOCONUSSelected"></b-form-checkbox>
                      </div>
                      <div v-if="travelmodel.InternalData.OCONUSTravel == 'Yes'" class="col-6">
                        <b-form-select class="form-control-sm form-control-travel" v-model="travelmodel.OCONUSLocation" :options="locations" :state="ValidateMe('OL')" ref="OCONUSLocation"></b-form-select>
                        <b-form-invalid-feedback>
                          Must Select OCONUS Location
                        </b-form-invalid-feedback>
                      </div>
                      <div v-else class="col-6"></div>
                    </div>
                    <div class="row">
                      <div class="col-12">Subject</div>
                    </div>
                    <div class="row">
                      <div class="col-12"><b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.Subject" :state="ValidateMe('Subject')" ref="Subject"></b-form-input></div>
                      <b-form-invalid-feedback>
                        Enter a subject for this travel request
                      </b-form-invalid-feedback>
                    </div>
                    <div class="row">
                      <div class="col-6">Company</div>
                      <div class="col-6">WorkPlan</div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <b-form-select class="form-control-sm form-control-travel" v-model="travelmodel.Company" :options="companies" :state="ValidateMe('Company')" ref="Company" @change="onCompanySelected"></b-form-select>
                        <b-form-invalid-feedback>
                          Please Select A Company
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col-6">
                        <b-form-select class="form-control-sm form-control-travel" v-model="travelmodel.WorkPlanNumber" :options="workplans" :state="ValidateMe('WorkPlan')" ref="WorkPlan" @change="onWorkplanSelected"></b-form-select>
                        <b-form-invalid-feedback>
                          Please Select A WorkPlan
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">Start Date</div>
                      <div class="col-6">End Date</div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <b-form-input class="form-control-sm form-control-travel form-control-travel-date" v-model="travelmodel.StartTime" ref="start" type="date" title="Start" :state="ValidateMe('start')"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter a valid date (mm/dd/yyyy)
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col-6">
                        <b-form-input class="form-control-sm form-control-travel form-control-travel-date" v-model="travelmodel.EndTime" ref="end" type="date" title="End" :state="ValidateMe('end')"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter a valid date (mm/dd/yyyy)
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">Traveling From</div>
                      <div class="col-6">Traveling To</div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.TravelFrom" :state="ValidateMe('TravelFrom')" ref="TravelFrom"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter at least 3 letters
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col-6">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.TravelTo" :state="ValidateMe('TravelTo')" ref="TravelTo"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter at least 3 letters
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                  </b-form>
                </b-tab>
                <b-tab class="mtab">
                  <template slot="title"
                    ><font-awesome-icon fas icon="user" class="icon"></font-awesome-icon>
                    Traveler Details
                  </template>
                  <b-form>
                    <b-table id="TravelersTable" ref="TravelersTable" responsive v-model="travelerData" :striped="striped" :bordered="bordered" :small="small" :hover="hover" :items="travelmodel.Travelers" :fields="fields" style="table-layout: fixed;">
                      <template v-slot:cell(actions)="data">
                        <b-button size="sm" class="actionbutton" @click="deleteme(data.index)" title="Delete Traveler">
                          <font-awesome-icon far icon="trash" class="icon" :style="{ color: 'red' }"></font-awesome-icon>
                        </b-button>
                      </template>
                      <template v-slot:cell(firstName)="data">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelerData[data.index].firstName" v-bind:id="getRef('trvlfirstName', data.index)" title="First Name"></b-form-input>
                      </template>
                      <template v-slot:cell(lastName)="data">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelerData[data.index].lastName" v-bind:id="getRef('trvllastName', data.index)" title="Last Name"></b-form-input>
                      </template>
                      <template v-slot:cell(email)="data">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelerData[data.index].email" v-bind:id="getRef('trvlemail', data.index)" title="Email"></b-form-input>
                      </template>
                      <template v-slot:cell(phone)="data">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelerData[data.index].phone" v-bind:id="getRef('trvlphone', data.index)" title="Phone"></b-form-input>
                      </template>
                    </b-table>
                  </b-form>
                  <div class="row">
                    <div cols="12">
                      <b-button size="sm" @click="btnAddTraveler" variant="success">Add Traveler</b-button>
                    </div>
                  </div>
                </b-tab>
                <b-tab class="mtab">
                  <template slot="title"
                    ><font-awesome-icon fas icon="info-circle" class="icon"></font-awesome-icon>
                    Additional Info
                  </template>
                  <b-form>
                    <div class="row">
                      <div class="col">Gov Sponsor</div>
                      <div class="col">Estimated Cost</div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.Sponsor" ref="Sponsor" :state="ValidateMe('Sponsor')"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter a valid Sponsor.
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.EstimatedCost" ref="EstimatedCost" :state="ValidateMe('EstimatedCost')"></b-form-input>
                        <b-form-invalid-feedback>
                          Numbers only
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">POC Name</div>
                      <div class="col">POC Email</div>
                      <div class="col">POC Phone</div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.POCName" ref="POCName" :state="ValidateMe('POCName')"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter a Name
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.POCEmail" ref="POCEmail" :state="ValidateMe('POCEmail')"></b-form-input>
                        <b-form-invalid-feedback>
                          Invalid email address
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.POCPhone" ref="POCPhone" :state="ValidateMe('POCPhone')"></b-form-input>
                        <b-form-invalid-feedback>
                          (###)-###-#### Format
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12">Purpose</div>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <b-form-textarea
                          class="form-control-sm form-control-travel-textarea"
                          v-model="travelmodel.Comments"
                          placeholder="Please enter 1-2 sentences to describe what is to be accomplished by taking this trip and why it is beneficial to the government.  Spell out all acronyms."
                          rows="3"
                          max-rows="6"
                          ref="Comments"
                          :state="ValidateMe('Comments')"
                        ></b-form-textarea>
                        <b-form-invalid-feedback>
                          Not properly filled out.
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                  </b-form>
                </b-tab>
                <b-tab class="mtab">
                  <template slot="title"
                    ><font-awesome-icon fas icon="user-shield" class="icon"></font-awesome-icon>
                    Security Info
                  </template>
                  <b-form>
                    <div class="row">
                      <div class="col">Visit Request</div>
                      <div class="col" v-if="travelmodel.VisitRequest === 'Yes'">Clearance</div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <b-form-checkbox v-model="travelmodel.VisitRequest" value="Yes" unchecked-value="No" ref="VisitRequest" switch>Required</b-form-checkbox>
                      </div>
                      <div class="col" v-if="travelmodel.VisitRequest === 'Yes'">
                        <b-form-select class="form-control-sm form-control-travel float-left" v-model="travelmodel.Clearance" :options="levels" ref="Clearance" :state="ValidateMe('Clearance')"></b-form-select>
                        <b-form-invalid-feedback>
                          Please select a valid option
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                  </b-form>
                </b-tab>
                <b-tab class="mtab">
                  <template slot="title"
                    ><font-awesome-icon fas icon="traffic-light" class="icon"></font-awesome-icon>
                    Summary
                  </template>
                  <table id="SummaryTable" class="summarytable">
                    <tbody>
                      <tr class="bg-warning text-white">
                        <td colspan="4">Subject</td>
                        <td>Travel Index</td>
                      </tr>
                      <tr>
                        <td colspan="4">{{ travelmodel.Subject }}</td>
                        <td>{{ travelmodel.IndexNumber }}</td>
                      </tr>
                      <tr class="bg-warning text-white">
                        <td colspan="2">Company</td>
                        <td colspan="3">WorkPlan</td>
                      </tr>
                      <tr>
                        <td colspan="2">{{ travelmodel.Company }}</td>
                        <td colspan="3">{{ travelmodel.WorkPlanText }}</td>
                      </tr>
                      <tr class="bg-warning text-white">
                        <td>Start Date</td>
                        <td>End Date</td>
                        <td>Traveling From</td>
                        <td>Traveling To</td>
                        <td>Estimated Cost</td>
                      </tr>
                      <tr>
                        <td>{{ travelmodel.StartTime }}</td>
                        <td>{{ travelmodel.EndTime }}</td>
                        <td>{{ travelmodel.TravelFrom }}</td>
                        <td>{{ travelmodel.TravelTo }}</td>
                        <td>${{ travelmodel.EstimatedCost }}</td>
                      </tr>
                      <tr class="bg-warning text-white">
                        <td>Gov Sponsor</td>
                        <td>POC Name</td>
                        <td colspan="2">POC Email</td>
                        <td>POC Phone</td>
                      </tr>
                      <tr>
                        <td>{{ travelmodel.Sponsor }}</td>
                        <td>{{ travelmodel.POCName }}</td>
                        <td colspan="2">{{ travelmodel.POCEmail }}</td>
                        <td>{{ travelmodel.POCPhone }}</td>
                      </tr>
                      <tr class="bg-warning text-white">
                        <td colspan="3">Purpose</td>
                        <td>Visit Request</td>
                        <td>Required Clearance</td>
                      </tr>
                      <tr>
                        <td colspan="3">{{ travelmodel.Comments }}</td>
                        <td>{{ travelmodel.VisitRequest }}</td>
                        <td>{{ travelmodel.Clearance }}</td>
                      </tr>
                      <tr>
                        <td colspan="5">
                          <table class="summarytable">
                            <thead>
                              <tr class="bg-warning text-white">
                                <td colspan="4">Travelers</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr class="bg-warning text-white">
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                              </tr>
                              <tr v-for="traveler in travelmodel.Travelers" :key="traveler">
                                <td>{{ traveler.firstName }}</td>
                                <td>{{ traveler.lastName }}</td>
                                <td>{{ traveler.email }}</td>
                                <td>{{ traveler.phone }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </b-row>
        <b-row class="m-0 pl-1 mt-1">
          <div class="col-4 p-0 text-left"></div>
          <div class="col-4 p-0 text-center">
            <b-button-group class="mt-2">
              <b-button variant="warning" v-if="tabIndex > 0" ref="btnPrev" @click="tabIndex--" class="mr-2 text-white">Previous</b-button>
              <b-button variant="warning" v-if="tabIndex < 4" ref="btnNext" @click="tabIndex++" class="text-white">Next</b-button>
            </b-button-group>
          </div>
          <div class="col-4 p-0 text-right">
            <b-button-group class="mt-2">
              <b-button variant="danger" ref="btnCancel" class="mr-2" @click="onModalCancel">Cancel</b-button>
              <b-button v-if="formValid" variant="success" ref="btnOk" class="ml-2" @click="onModalSave">Submit</b-button>
              <a ref="EmailLink" href="#" v-show="false">Email</a>
            </b-button-group>
          </div>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal id="NewTravelUser" ref="NewTravelUser" size="xl" centered hide-footer :header-bg-variant="headerBgVariant">
      <template v-slot:modal-title>Add Traveler [Double Click To Add The User]</template>
      <b-container fluid class="p-0">
        <b-row class="m-0">
          <b-col cols="12" class="p-0">
            <b-input-group>
              <b-form-input type="text" placeholder="Search..." class="form-control" v-model="searchinput" v-on:keyup.enter="searchme"></b-form-input>
              <b-input-group-append>
                <b-button variant="warning" @click.stop="searchme" title="Search">
                  <font-awesome-icon far icon="search" class="icon"></font-awesome-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <div class="row m-0">
          <div class="col-12 p-0" style="min-height: 500px;">
            <ejs-grid
              id="TravelPersonnelGrid"
              ref="TravelPersonnelGrid"
              :dataSource="pdata"
              :allowPaging="true"
              :allowSorting="true"
              :allowFiltering="true"
              :allowResizing="true"
              :pageSettings="NewTravelpageSettings"
              :editSettings="NewTraveleditSettings"
              :filterSettings="NewTravelfilterSettings"
              :sortSettings="NewTravelsortSettings"
              :actionBegin="NewTravelActionBegin"
              rowHeight="20"
              width="100%"
            >
              <e-columns>
                <e-column field="LastName" headerText="Last" textAlign="Left" width="120"></e-column>
                <e-column field="FirstName" headerText="First" width="100"></e-column>
                <e-column field="Position" headerText="Position" textAlign="Left" width="180"></e-column>
                <e-column field="Email" headerText="Email" textAlign="Left" width="300"></e-column>
                <e-column field="Phone" headerText="Phone" textAlign="Left" width="100"></e-column>
                <e-column field="Company" headerText="Company" textAlign="Left" width="250"></e-column>
                <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true"></e-column>
              </e-columns>
            </ejs-grid>
          </div>
        </div>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import User from '@/models/User'
import Travel from '@/models/Travel'
import Personnel from '@/models/Personnel'
import Workplan from '@/models/WorkPlan'
import Company from '@/models/Company'
import { Toolbar as RTEToolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table } from '@syncfusion/ej2-vue-richtexteditor'
import { Page, Sort, Filter, Edit, Resize, Reorder, ColumnMenu, Toolbar, Search } from '@syncfusion/ej2-vue-grids'

let vm = null

export default {
  name: 'NewTravel',
  props: {
    mode: {
      type: String,
      default: 'default'
    },
    Show: {
      type: Boolean,
      default: false
    },
    Start: {
      type: Date
    },
    End: {
      type: Date
    }
  },
  provide: {
    richtexteditor: [RTEToolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table],
    grid: [Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, Toolbar, Search]
  },
  computed: {
    emailRequired() {
      return Travel.getters('emailRequired')
    },
    personnel() {
      return Personnel.getters('allPersonnel')
    },
    workplans() {
      return Workplan.getters('DropDown')
    },
    companies() {
      return Company.getters('DropDown')
    },
    currentuser() {
      return User.getters('CurrentUser')
    },
    userid() {
      return User.getters('CurrentUserId')
    },
    appversion() {
      return User.getters('AppVersion')
    },
    isDeveloper() {
      return User.getters('isDeveloper')
    },
    portalemail() {
      return this.$store.state.support.portalemail
    }
  },
  mounted: function() {
    vm = this // Setting up page specific handle to 'this' which represents the vue component. Used in promise functions as they will have their on 'this'.
  },
  /* updated: function() {
    if (this.Start != null) {
      this.travelmodel.StartTime = this.Start
    }
    if (this.End != null) {
      this.travelmodel.EndTime = this.End
    }
  }, */
  data: function() {
    return {
      busyTitle: 'Getting Trip Data. Please Wait.',
      searchinput: '',
      reportdigest: null,
      reportlink: null,
      workplanuri: null,
      workplanetag: null,
      newindex: null,
      editing: false,
      fileSelected: null,
      fileBuffer: null,
      ManagerEmail: null,
      pdata: [],
      tabIndex: 0,
      tabInvalid: false,
      InvalidMessage: 'Not all fields are filled out correctly.',
      headerBgVariant: 'warning',
      travelmodel: {
        id: 0,
        Status: '',
        WorkPlan: '',
        WorkPlanText: '',
        WorkPlanNumber: '',
        OriginalWorkPlanNumber: '',
        OCONUS: 'Select...',
        OCONUSLocation: 'Select...',
        WorkPlanData: '',
        Company: '',
        Subject: '',
        StartTime: this.Start !== null ? this.Start : '',
        EndTime: this.End !== null ? this.End : '',
        TravelFrom: '',
        TravelTo: '',
        Travelers: [],
        TravelersText: '',
        Sponsor: '',
        POCName: '',
        POCEmail: '',
        POCPhone: '',
        Comments: '',
        Clearance: 'None',
        InternalData: {
          Status: 'WPMReview',
          PreApproved: 'No',
          OCONUSTravel: 'No',
          ApprovalRequested: 'No',
          Approval: '',
          ApprovedBy: '',
          ApprovedOn: '',
          DeniedBy: '',
          DeniedOn: '',
          DenialComments: '',
          ATPRequested: 'No',
          ATP: '',
          ATPGrantedBy: '',
          ATPGrantedOn: '',
          ATPDeniedBy: '',
          ATPDeniedOn: '',
          ATPDenialComments: '',
          ManagerEmail: '',
          date: this.$moment().format('MM/DD/YYYY')
        },
        VisitRequest: '',
        EstimatedCost: '',
        IndexNumber: '',
        etag: '',
        uri: ''
      },
      NewTravelpageSettings: { pageSize: 30 },
      NewTraveleditSettings: {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: false,
        mode: 'Dialog'
      },
      NewTravelsortSettings: {
        columns: [{ field: 'LastName', direction: 'Ascending' }]
      },
      toolbarSettings: {
        items: [
          'Bold',
          'Italic',
          'Underline',
          'Outdent',
          'Indent',
          '|',
          'ClearFormat',
          'Print',
          /* 'SourceCode',
          'FullScreen', */
          '|',
          'Undo',
          'Redo'
        ]
      },
      NewTravelfilterSettings: { type: 'Menu' },
      fieldsFirstTab: ['WorkPlan', 'Company', 'start', 'end', 'TravelFrom', 'TravelTo'],
      fieldsThirdTab: ['Sponsor', 'EstimatedCost', 'POCName', 'POCEmail', 'POCPhone', 'Comments', 'Clearance'],
      fieldsFourthTab: ['Clearance'],
      travelerData: [],
      formValid: false,
      fields: [
        {
          key: 'actions',
          label: 'Action',
          thClass: 'bg-warning text-white text-center px40'
        },
        {
          key: 'firstName',
          label: 'First Name',
          thClass: 'bg-warning text-white text-center px80'
        },
        {
          key: 'lastName',
          label: 'Last Name',
          thClass: 'bg-warning text-white text-center px80'
        },
        {
          key: 'email',
          label: 'Email',
          thClass: 'bg-warning text-white text-center px200'
        },
        {
          key: 'phone',
          label: 'Phone',
          thClass: 'bg-warning text-white text-center px100'
        }
      ],
      levels: [
        { value: 'None', text: 'None' },
        { value: 'S', text: 'S' },
        { value: 'TS', text: 'TS' },
        { value: 'TSSCI', text: 'TS/SCI' }
      ],
      yesno: [
        { value: 'Select...', text: 'Select...' },
        { value: 'No', text: 'No' },
        { value: 'Yes', text: 'Yes' }
      ],
      locations: [
        { value: 'Select...', text: 'Select...' },
        { value: 'Germany', text: 'Germany' },
        { value: 'Korea', text: 'Korea' }
      ],
      requiresSecurity: false,
      wpetag: null,
      wpuri: null
    }
  },
  methods: {
    /* ---------------------------------------------------------------------------------------------------------------- Base Events -------------------------------------------------------------------------------- */
    getRef(text, idx) {
      return text + '_' + idx
    },
    /* ---------------------------------------------------------------------------------------------------------------- End Base Events ---------------------------------------------------------------------------- */
    /* ---------------------------------------------------------------------------------------------------------------- Validation Events -------------------------------------------------------------------------- */
    ValidateMe: function(control) {
      let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
      let emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      let ret = false
      switch (control) {
        case 'O':
          if (this.travelmodel.OCONUS == 'Yes' || this.travelmodel.OCONUS == 'No') {
            ret = true
          }
          break

        case 'OL':
          if (this.travelmodel.OCONUS == 'Yes') {
            if (this.travelmodel.OCONUSLocation != 'Select...') {
              ret = true
            }
          } else {
            ret = true
          }
          break

        case 'Subject':
          ret = this.travelmodel.Subject.length > 2 ? true : false
          break

        case 'Company':
          ret = this.travelmodel.Company != '' ? true : false
          break

        case 'WorkPlan':
          var val = this.travelmodel.WorkPlanNumber
          var good = false
          if (val.length > 0) {
            good = true
          }
          ret = good
          break

        case 'start':
          ret = this.$moment(this.travelmodel.StartTime).isValid() ? true : false
          break

        case 'end':
          ret = this.$moment(this.travelmodel.EndTime).isValid() ? true : false
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
          var req = this.travelmodel.VisitRequest
          val = this.travelmodel.Clearance
          good = false
          if (req === 'Yes' && val !== 'None') {
            good = true
          }
          ret = good
          break
      }
      return ret
    },
    validateFirstTab: function() {
      // check all the fields in the first tab to see that they are properly validated
      let valid = true
      for (let i = 0; i < this.fieldsFirstTab.length; i++) {
        if (this.$refs[this.fieldsFirstTab[i]].state === false) {
          valid = false
        }
      }
      return valid
    },
    validateSecondTab: function() {
      // check all the fields in the first tab to see that they are properly validated
      let valid = true
      if (this.travelmodel.Travelers.length <= 0) {
        valid = false
      }
      return valid
    },
    validateThirdTab: function() {
      // check all the fields in the first tab to see that they are properly validated
      let valid = true
      for (let i = 0; i < this.fieldsThirdTab.length; i++) {
        if (this.fieldsThirdTab[i] !== 'Clearance') {
          if (this.$refs[this.fieldsThirdTab[i]].state === false) {
            valid = false
          }
        } else {
          let req = this.travelmodel.VisitRequest
          let val = this.travelmodel.Clearance
          if (req === 'yes' && val === 'Select') {
            valid = false
          }
        }
      }
      return valid
    },
    /* ---------------------------------------------------------------------------------------------------------------- End Validation Events ------------------------------------------------------------------------ */
    /* ---------------------------------------------------------------------------------------------------------------- Form Events ---------------------------------------------------------------------------------- */
    onModalCancel: function() {
      // Clear the travelmodel and close the popup
      this.resetTravelModel()
      this.$emit('close')
    },
    onTabSelected: function(newidx, oldidx, event) {
      // Now we can validate the tabs based on what tab is clicked
      this.tabInvalid = false
      if (newidx > 0) {
        switch (newidx) {
          case 1:
            if (newidx > oldidx) {
              let valid = this.validateFirstTab()
              if (!valid) {
                event.preventDefault()
                this.tabInvalid = true
              }
            }
            break

          case 2:
            if (newidx > oldidx) {
              let valid = this.validateSecondTab()
              if (!valid) {
                event.preventDefault()
                this.tabInvalid = true
              }
            }
            break

          case 3:
            var fv = true
            if (newidx > oldidx && oldidx == 0) {
              let valid = this.validateFirstTab()
              if (!valid) {
                event.preventDefault()
                this.tabInvalid = true
                fv = false
              }
            }
            if (newidx > oldidx && oldidx == 2) {
              let valid = this.validateThirdTab()
              if (!valid) {
                event.preventDefault()
                this.tabInvalid = true
                fv = false
              }
            }
            this.formValid = fv
            break
        }
      }
    },
    searchme: function() {
      this.$refs.TravelPersonnelGrid.search(this.searchinput)
    },
    onOCONUSSelected: function() {
      // TODO: Maybe show location area from here
      if (this.travelmodel.InternalData.OCONUSTravel == 'Yes') {
        this.fieldsFirstTab.push('OCONUSLocation')
      } else {
        // if the user accidentally selected yes and then changes it, we have to remove location from the validation array
        this.fieldsFirstTab = this.fieldsFirstTab.filter(e => e != 'OCONUSLocation')
      }
    },
    async onWorkplanSelected() {
      let s = String(this.travelmodel.WorkPlanNumber)
      let t = this.workplans.filter(workplan => workplan.value == s)
      let wp = t[0].data
      wp = wp.split(', ')
      this.workplanuri = wp[4]
      this.workplanetag = wp[5]
      this.newindex = Number(wp[3]) + 1
      this.wpetag = wp[5]
      this.wpuri = wp[4]
      this.travelmodel.WorkPlan = t[0].data
      this.travelmodel.WorkPlanText = wp[1]
      this.travelmodel.IndexNumber = wp[0] + '-' + this.newindex
      let manager = await Workplan.dispatch('getManagerByWPNumber', wp[0])
      console.log(manager)
      this.ManagerEmail = manager[0]['Manager']['EMail']
      this.travelmodel.InternalData.ManagerEmail = manager[0]['Manager']['EMail']
    },
    onCompanySelected: function() {
      // TODO: Validate if this should drive the selection of workplans and personnel
    },
    VisitRequest(checked) {
      this.travelmodel.VisitRequest = checked ? true : false
    },
    btnAddTraveler: function() {
      // Used in NewTravelUser when selecting a traveler.
      this.$bvModal.show('NewTravelUser')
    },
    NewTravelActionBegin(args) {
      // Used in NewTravelUser when selecting a traveler.
      switch (args.requestType) {
        case 'beginEdit':
          args.cancel = true
          vm.travelmodel.Travelers.push({
            firstName: args.rowData.FirstName,
            lastName: args.rowData.LastName,
            email: args.rowData.Email,
            phone: args.rowData.Phone
          })
          this.$bvModal.hide('NewTravelUser')
          break
      }
    },
    resetTravelModel: function() {
      // reset travelmodel
      this.travelmodel = {
        id: 0,
        Status: '',
        WorkPlan: '',
        WorkPlanText: '',
        WorkPlanNumber: '',
        OriginalWorkPlanNumber: '',
        OCONUS: 'Select...',
        OCONUSLocation: 'Select...',
        PreApproved: '',
        WorkPlanData: '',
        Company: '',
        Subject: '',
        StartTime: '',
        EndTime: '',
        TravelFrom: '',
        TravelTo: '',
        Travelers: [],
        TravelersText: '',
        Sponsor: '',
        POCName: '',
        POCEmail: '',
        POCPhone: '',
        Comments: '',
        InternalData: {
          Status: 'WPMReview',
          PreApproved: 'No',
          OCONUSTravel: 'No',
          ApprovalRequested: 'No',
          Approval: '',
          ApprovedBy: '',
          ApprovedOn: '',
          DeniedBy: '',
          DeniedOn: '',
          DenialComments: '',
          ATPRequested: 'No',
          ATP: '',
          ATPGrantedBy: '',
          ATPGrantedOn: '',
          ATPDeniedBy: '',
          ATPDeniedOn: '',
          ATPDenialComments: '',
          ManagerEmail: '',
          date: this.$moment().format('MM/DD/YYYY')
        },
        Clearance: 'None',
        VisitRequest: '',
        EstimatedCost: '',
        IndexNumber: '',
        etag: '',
        uri: ''
      }
    },
    deleteme: function(idx) {
      this.travelmodel.Travelers.splice(idx, 1)
    },
    async onModalSave() {
      // Update the trip information in SharePoint.
      Workplan.dispatch('getDigest')
      let event = []
      let start = this.$moment(this.travelmodel.StartTime).format('YYYY-MM-DD[T]HH:MM:[00Z]')
      let end = this.$moment(this.travelmodel.EndTime).format('YYYY-MM-DD[T]HH:MM:[00Z]')
      let status = 'WPMReview'
      event.push({
        Subject: this.travelmodel.Subject,
        StartTime: start,
        EndTime: end,
        Status: status,
        WorkPlan: this.travelmodel.WorkPlan,
        WorkPlanNumber: this.travelmodel.WorkPlanNumber,
        OriginalWorkPlanNumber: this.travelmodel.OriginalWorkPlanNumber,
        WorkPlanText: this.travelmodel.WorkPlanText,
        IndexNumber: this.travelmodel.IndexNumber,
        OCONUS: this.travelmodel.InternalData.OCONUSTravel,
        OCONUSLocation: this.travelmodel.OCONUSLocation,
        Company: this.travelmodel.Company,
        TravelFrom: this.travelmodel.TravelFrom,
        TravelTo: this.travelmodel.TravelTo,
        Travelers: this.travelmodel.Travelers,
        Sponsor: this.travelmodel.Sponsor,
        POCName: this.travelmodel.POCName,
        POCEmail: this.travelmodel.POCEmail,
        POCPhone: this.travelmodel.POCPhone,
        Comments: this.travelmodel.Comments,
        InternalData: this.travelmodel.InternalData,
        Clearance: this.travelmodel.Clearance,
        VisitRequest: this.travelmodel.VisitRequest,
        EstimatedCost: this.travelmodel.EstimatedCost,
        etag: this.travelmodel.etag,
        uri: this.travelmodel.uri
      })
      let response = await Travel.dispatch('addTrip', event)
      let id = response.data.d.Id
      let payload = {}
      payload.uri = this.wpuri
      payload.etag = this.wpetag
      payload.index = this.newindex
      Workplan.dispatch('updateIndex', payload)
      if (this.emailRequired) {
        Travel.dispatch('sendEmail', id).then(function() {
          vm.$store.dispatch('support/addActivity', '<div class="bg-success">NewTravel - Sent Security Email</div>')
          let payload = {}
          payload.id = id
          payload.email = vm.ManagerEmail
          Travel.dispatch('NewTripEmail', payload).then(function() {
            vm.$store.dispatch('support/addActivity', '<div class="bg-success">NewTravel - Sent New Trip Email</div>')
            vm.$emit('close')
            let path = '/travel/home/refresh' + vm.mode
            vm.$router.push({ path: path })
          })
        })
      }
      payload = {}
      payload.id = id
      payload.email = this.ManagerEmail
      Travel.dispatch('NewTripEmail', payload).then(function() {
        vm.$store.dispatch('support/addActivity', '<div class="bg-success">NewTravel - Sent New Trip Email</div>')
        vm.resetTravelModel()
        vm.$emit('close')
        let path = '/travel/home/refresh' + vm.mode
        vm.$router.push({ path: path })
      })
    }
  },
  watch: {
    Show: function() {
      if (this.Show == true) {
        // Load supporting data and the trip
        if (this.personnel && this.personnel.length > 0) {
          this.pdata = this.personnel
          if (this.Start != null) {
            this.travelmodel.StartTime = this.Start
          }
          if (this.End != null) {
            this.travelmodel.EndTime = this.End
          }
          // If personnel exist then companies and workplans should exist. companies could already exist if opened from travel tracker.
        } else {
          Personnel.dispatch('getPersonnel').then(function() {
            Workplan.dispatch('getWorkplans').then(function() {
              Company.dispatch('getCompanies').then(function() {
                // all data should be loaded
                vm.pdata = vm.personnel
                if (this.Start != null) {
                  this.travelmodel.StartTime = this.Start
                }
                if (this.End != null) {
                  this.travelmodel.EndTime = this.End
                }
              })
            })
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
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

.form-control-travel {
  padding: 2px !important;
  font-size: 0.75rem !important;
  height: 20px !important;
}

.form-control-travel-date.is-invalid,
.form-control-travel-date.is-valid,
.was-validated .form-control-travel-date:invalid,
.was-validated .form-control-travel-date:valid {
  background-position: right calc(1.5rem) center !important;
}
</style>
