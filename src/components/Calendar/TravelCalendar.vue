/* eslint-disable no-undef */ /* eslint-disable no-undef */
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
              <b-tabs ref="dashboardtabs" class="tabArea" card v-model="tabIndex" @activate-tab="onTabSelected">
                <b-tab class="mtab" active>
                  <template slot="title"
                    ><font-awesome-icon fas icon="cog" class="icon"></font-awesome-icon>
                    Travel Information
                  </template>
                  <b-form>
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
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.Company" :state="ValidateMe('Company')" ref="Company"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter at least 3 letters
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col-6">
                        <b-form-select class="form-control-sm form-control-travel" v-model="travelmodel.WorkPlanNumber" :options="workplans" :state="ValidateMe('WorkPlan')" ref="WorkPlan" @change="onWorkplanSelected"></b-form-select>
                        <b-form-invalid-feedback>
                          Enter in YY-XXXX format (Proper WorkPlan format)
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">Start Date</div>
                      <div class="col-6">End Date</div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.StartTime" ref="start" type="date" title="Start" :state="ValidateMe('start')"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter a valid date (mm/dd/yyyy)
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col-6">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.EndTime" ref="end" type="date" title="End" :state="ValidateMe('end')"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter a valid date (mm/dd/yyyy)
                        </b-form-invalid-feedback>
                      </div>
                    </div>
                    <div class="row" v-if="editing">
                      <div class="col-4">Traveling From</div>
                      <div class="col-4">Traveling To</div>
                      <div class="col-4">Trip Report</div>
                    </div>
                    <div class="row" v-else>
                      <div class="col-6">Traveling From</div>
                      <div class="col-6">Traveling To</div>
                    </div>
                    <div class="row" v-if="editing">
                      <div class="col-4">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.TravelFrom" :state="ValidateMe('TravelFrom')" ref="TravelFrom"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter at least 3 letters
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col-4">
                        <b-form-input class="form-control-sm form-control-travel" v-model="travelmodel.TravelTo" :state="ValidateMe('TravelTo')" ref="TravelTo"></b-form-input>
                        <b-form-invalid-feedback>
                          Enter at least 3 letters
                        </b-form-invalid-feedback>
                      </div>
                      <div class="col-4">
                        <a :href="travelmodel.TripReportLink">{{ travelmodel.TripReport }}</a>
                      </div>
                    </div>
                    <div class="row" v-else>
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
                    <div class="row" v-if="editing">
                      <table class="mt-1">
                        <tbody>
                          <tr class="text-center bg-warning text-white">
                            <th>Upload Trip Report [This replaces any existing trip report]</th>
                          </tr>
                          <tr>
                            <td><ejs-uploader id="fileupload" name="UploadFiles" :selected="onFileSelect" :multiple="false"></ejs-uploader></td>
                          </tr>
                        </tbody>
                      </table>
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
                      <b-button size="sm" @click="btnAddClick" variant="success">Add Traveler</b-button>
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
                      <div class="col">Visit Request</div>
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
                      <div class="col">
                        <b-form-checkbox v-model="travelmodel.VisitRequest" value="Yes" unchecked-value="No" ref="VisitRequest" switch>Required</b-form-checkbox>
                        <b-form-select v-if="travelmodel.VisitRequest === 'Yes'" class="form-control-sm form-control-travel float-left" v-model="travelmodel.Clearance" :options="levels" ref="Clearance" :state="ValidateMe('Clearance')"></b-form-select>
                        <b-form-invalid-feedback v-if="travelmodel.VisitRequest === 'Yes'">
                          Please select a valid option
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
                          class="form-control-sm form-control-travel"
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
                        <td v-if="editing" colspan="2">Purpose</td>
                        <td v-else colspan="3">Purpose</td>
                        <td>Visit Request</td>
                        <td>Required Clearance</td>
                        <td v-if="editing">TripReport</td>
                      </tr>
                      <tr>
                        <td v-if="editing" colspan="2">
                          <div>{{ travelmodel.Comments }}</div>
                        </td>
                        <td v-else colspan="3"><form-textarea disabled v-model="travelmodel.Comments" rows="3" max-rows="6"></form-textarea></td>
                        <td>{{ travelmodel.VisitRequest }}</td>
                        <td>{{ travelmodel.Clearance }}</td>
                        <td v-if="editing">{{ travelmodel.TripReport }}</td>
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
        </div>
        <div class="row mt-1">
          <div class="col-12 p-0 text-center">
            <b-button-group class="mt-2">
              <b-button variant="danger" ref="btnCancel" class="mr-2" @click="onModalCancel">Cancel</b-button>
              <b-button v-if="tabIndex > 0" ref="btnPrev" @click="tabIndex--">Previous</b-button>
              <b-button v-if="tabIndex < 3" ref="btnNext" @click="tabIndex++">Next</b-button>
              <b-button v-if="tabIndex == 3 && formValid" variant="success" ref="btnOk" class="ml-2" @click="onModalSave">Submit</b-button>
            </b-button-group>
          </div>
        </div>
      </b-container>
    </b-modal>
    <div class="row">
      <ejs-schedule
        id="TravelCalendar"
        ref="TravelCalendar"
        cssClass="contentHeight"
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
          <e-view option="Week"></e-view>
          <e-view option="Month"></e-view>
        </e-views>
      </ejs-schedule>
    </div>
    <b-modal id="PersonnelModal" ref="PersonnelModal" size="xl" centered hide-footer :header-bg-variant="headerBgVariant">
      <template v-slot:modal-title>Add Traveler [Double Click To Add The User]</template>
      <b-container fluid class="p-0">
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
              :pageSettings="pageSettings"
              :editSettings="editSettings"
              :filterSettings="filterSettings"
              :sortSettings="sortSettings"
              :actionBegin="actionBegin"
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
    <b-modal id="ViewModal" ref="ViewModal" size="xl" centered hide-footer :header-bg-variant="headerBgVariant" @hide="onModalHide">
      <template v-slot:modal-title>{{ selectedtrip.Subject }}</template>
      <b-container fluid>
        <table id="ViewTable">
          <tbody>
            <tr class="bg-black text-white">
              <th>Workplan</th>
              <th>Company</th>
              <th>Start</th>
              <th>End</th>
              <th>From</th>
              <th>To</th>
            </tr>
            <tr>
              <td>{{ selectedtrip.WorkPlan }}</td>
              <td>{{ selectedtrip.Company }}</td>
              <td>{{ formatme(selectedtrip.StartTime, 'normal') }}</td>
              <td>{{ formatme(selectedtrip.EndTime, 'normal') }}</td>
              <td>{{ selectedtrip.TravelFrom }}</td>
              <td>{{ selectedtrip.TravelTo }}</td>
            </tr>
            <tr class="bg-black text-white">
              <th colspan="2">Sponsor</th>
              <th>POC Name</th>
              <th>POC Email</th>
              <th>POC Phone</th>
              <th>Estimated Cost</th>
            </tr>
            <tr>
              <td colspan="2">{{ selectedtrip.Sponsor }}</td>
              <td>{{ selectedtrip.POCName }}</td>
              <td>{{ selectedtrip.POCEmail }}</td>
              <td>{{ selectedtrip.POCPhone }}</td>
              <td>${{ selectedtrip.EstimatedCost }}</td>
            </tr>
            <tr class="bg-black text-white">
              <th colspan="4">Purpose</th>
              <th>Visit Request</th>
              <th>Required Clearance</th>
            </tr>
            <tr>
              <td colspan="4">{{ selectedtrip.Comments }}</td>
              <td>{{ selectedtrip.VisitRequest }}</td>
              <td>{{ selectedtrip.Clearance }}</td>
            </tr>
            <tr class="bg-black text-white">
              <th colspan="6">Travelers</th>
            </tr>
            <tr>
              <td colspan="6">
                <table style="width: 100%;">
                  <tbody>
                    <tr class="bg-black text-white">
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                    </tr>
                    <tr v-for="traveler in selectedtrip.Travelers" :key="traveler">
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
      </b-container>
    </b-modal>
    <b-modal id="ApproveModal" ref="ApproveModal" size="xl" centered hide-footer :header-bg-variant="headerBgVariant" @hide="onModalHide">
      <template v-slot:modal-title>Approve Travel Requests</template>
      <b-container fluid>
        <b-form>
          <b-table id="ApprovalsTable" :ref="ApprovalsTable" v-model="approvalData" responsive :striped="striped" :bordered="bordered" :small="small" :hover="hover" :items="approvalItems" :fields="approvalfields" :primary-key="ID" style="table-layout: fixed;">
            <template v-slot:cell(actions)="data">
              <b-button size="sm" class="actionbutton" @click="approveme(data.index)" title="Approve It">
                <font-awesome-icon far icon="check-circle" class="icon" :style="{ color: 'green' }"></font-awesome-icon>
              </b-button>
              <b-button size="sm" class="actionbutton" @click="data.toggleDetails">
                <font-awesome-icon v-if="data.detailsShowing" far class="icon" icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
                <font-awesome-icon v-else-if="approvalData[data.index].Comments !== ''" far class="icon" icon="plus-square" :style="{ color: 'green' }"></font-awesome-icon>
                <font-awesome-icon v-else far class="icon" icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
              </b-button>
            </template>
            <template v-slot:cell(StartTime)="data">
              <div>
                {{ formatme(approvalData[data.index].StartTime, 'normal') }}
              </div>
            </template>
            <template v-slot:cell(EndTime)="data">
              <div>
                {{ formatme(approvalData[data.index].EndTime, 'normal') }}
              </div>
            </template>
            <template v-slot:row-details="data">
              <!-- <b-input-group size="sm" prepend="Description">
                <b-form-input v-model="approvalData[data.index].Comments"></b-form-input>
              </b-input-group> -->
              <table style="width: 100%;">
                <tbody>
                  <tr>
                    <th colspan="4" class="bg-black text-white text-center">
                      Purpose
                    </th>
                  </tr>
                  <tr>
                    <th colspan="4">{{ approvalData[data.index].Comments }}</th>
                  </tr>
                  <tr>
                    <th colspan="4" class="bg-black text-white text-center">
                      Travelers
                    </th>
                  </tr>
                  <tr class="bg-black text-white">
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                  <tr v-for="traveler in approvalData[data.index].Travelers" :key="traveler">
                    <td>{{ traveler.firstName }}</td>
                    <td>{{ traveler.lastName }}</td>
                    <td>{{ traveler.email }}</td>
                    <td>{{ traveler.phone }}</td>
                  </tr>
                </tbody>
              </table>
            </template>
          </b-table>
        </b-form>
      </b-container>
    </b-modal>
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
import Travel from '@/models/Travel'
import Personnel from '@/models/Personnel'
import Workplan from '@/models/WorkPlan'
import { isNullOrUndefined } from 'util'

Vue.use(SchedulePlugin)
Vue.use(GridPlugin)
Vue.use(UploaderPlugin)

var vm = null // setup a global instance pointer to the vue component. This is set in mounted

let data = []

// eslint-disable-next-line no-undef
let server = _spPageContextInfo.webAbsoluteUrl
let library = 'TripReports'

export default {
  name: 'Calendar',
  props: {
    mode: String
  },
  computed: {
    travelloaded() {
      return Travel.getters('loaded')
    },
    travel() {
      return Travel.getters('allTravel')
    },
    emailRequired() {
      return Travel.getters('emailRequired')
    },
    personnel() {
      return Personnel.getters('allPersonnel')
    },
    workplans() {
      return Workplan.getters('DropDown')
    },
    currentuser() {
      return User.getters('CurrentUser')
    }
  },
  provide: {
    // schedule: [Day, Week, Month, Resize, DragAndDrop],
    schedule: [Day, Week, Month],
    grid: [Page, Sort, Filter, Edit, Reorder, Resize, ColumnMenu, ContextMenu]
  },
  data: function() {
    return {
      moreevents: false,
      reportdigest: null,
      reportlink: null,
      workplanuri: null,
      workplanetag: null,
      newindex: null,
      editing: false,
      fileSelected: null,
      fileBuffer: null,
      pdata: [],
      tabIndex: 0,
      tabInvalid: false,
      InvalidMessage: 'Not all fields are filled out correctly.',
      pageSettings: { pageSize: 30 },
      editSettings: {
        allowEditing: true,
        allowAdding: false,
        allowDeleting: false,
        mode: 'Dialog'
      },
      sortSettings: {
        columns: [{ field: 'LastName', direction: 'Ascending' }]
      },
      filterSettings: { type: 'Menu' },
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
      travelmodel: {
        id: 0,
        Status: '',
        WorkPlan: '',
        WorkPlanText: '',
        WorkPlanNumber: '',
        OriginalWorkPlanNumber: '',
        WorkPlanData: '',
        Company: '',
        Subject: '',
        StartTime: '',
        EndTime: '',
        TravelFrom: '',
        TravelTo: '',
        Travelers: [],
        Sponsor: '',
        POCName: '',
        POCEmail: '',
        POCPhone: '',
        Comments: '',
        Clearance: 'None',
        VisitRequest: '',
        EstimatedCost: '',
        IndexNumber: '',
        TripReport: '',
        TripReportLink: '',
        etag: '',
        uri: ''
      },
      selectedtrip: {},
      fieldsFirstTab: ['WorkPlan', 'Company', 'start', 'end', 'TravelFrom', 'TravelTo'],
      fieldsThirdTab: ['Sponsor', 'EstimatedCost', 'POCName', 'POCEmail', 'POCPhone', 'Comments', 'Clearance'],
      travelerData: [],
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
      approvalData: [],
      approvalItems: [],
      approvalfields: [
        {
          key: 'actions',
          label: 'Action',
          thClass: 'bg-warning text-white text-center px40'
        },
        {
          key: 'Subject',
          label: 'Title',
          thClass: 'bg-warning text-white text-center px250'
        },
        {
          key: 'StartTime',
          label: 'Start Date',
          thClass: 'bg-warning text-white text-center px80'
        },
        {
          key: 'EndTime',
          label: 'End Date',
          thClass: 'bg-warning text-white text-center px80'
        },
        {
          key: 'Sponsor',
          label: 'Gov Sponsor',
          thClass: 'bg-warning text-white text-center px100'
        },
        {
          key: 'Company',
          label: 'Company',
          thClass: 'bg-warning text-white text-center px100'
        },
        {
          key: 'WorkPlanText',
          label: 'Work Plan',
          thClass: 'bg-warning text-white text-center px80'
        },
        {
          key: 'EstimatedCost',
          label: 'Est. Cost',
          thClass: 'bg-warning text-white text-center px60'
        }
      ],
      requiresSecurity: false
    }
  },
  mounted: function() {
    vm = this
    Travel.dispatch('getDigest')
    Travel.dispatch('getTRIPS').then(function() {
      vm.$options.interval = setInterval(vm.waitForEvents, 1000)
    })
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
    waitForEvents: function() {
      if (this.travel && this.travel.length > 0) {
        clearInterval(this.$options.interval)
        let oldevents = this.$refs.TravelCalendar.getEvents()
        this.$refs.TravelCalendar.deleteEvent(oldevents)
        this.$refs.TravelCalendar.addEvent(this.travel)
        this.pdata = this.personnel
        if (!isNullOrUndefined(this.$route.query.id)) {
          document.getElementById('PageTitle').innerHTML = ' -  View'
          let id = Number(this.$route.query.id)
          let trip = this.travel.filter(trip => trip.id == id)
          trip = trip[0]
          trip.Travelers = JSON.parse(trip.Travelers)
          trip.StartTime = String(this.formatme(trip.StartTime, 'normal'))
          trip.EndTime = String(this.formatme(trip.EndTime, 'normal'))
          this.selectedtrip = trip
          this.$bvModal.show('ViewModal')
        } else {
          // what are we here for? default view? Or are we here to edit/update travel requests
          let items = this.travel.filter(trip => trip.Status == 'New')
          document.getElementById('ApprovalCount').innerHTML = items.length
          switch (this.mode) {
            case 'approval': {
              document.getElementById('PageTitle').innerHTML = ' -  Approval'
              let items = this.travel.filter(trip => trip.Status == 'New')
              for (let i = 0; i < items.length; i++) {
                let item = items[i]
                item.Travelers = JSON.parse(item.Travelers)
                this.approvalItems.push(item)
              }
              this.$bvModal.show('ApproveModal')
              break
            }
            case 'new': {
              document.getElementById('PageTitle').innerHTML = ' -  New Travel Request'
              this.$bvModal.show('modal-wizard')
              break
            }
            case 'default': {
              document.getElementById('PageTitle').innerHTML = ' -  Calendar'
              break
            }
          }
        }
      } else {
        // No travel yet so just allow entries
        this.pdata = this.personnel
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
        WorkPlanData: '',
        Company: '',
        Subject: '',
        StartTime: '',
        EndTime: '',
        TravelFrom: '',
        TravelTo: '',
        Travelers: [],
        Sponsor: '',
        POCName: '',
        POCEmail: '',
        POCPhone: '',
        Comments: '',
        Clearance: 'None',
        VisitRequest: '',
        EstimatedCost: '',
        IndexNumber: '',
        TripReport: '',
        TripReportLink: '',
        etag: '',
        uri: ''
      }
    },
    onModalHide: function(evt) {
      this.editing = false
      vm.resetTravelModel()
      if (this.mode == 'default') {
        Travel.dispatch('getTRIPS').then(function() {
          vm.$options.interval = setInterval(vm.waitForEvents, 1000)
        })
      } else {
        vm.$router.push({ name: 'Travel Calendar', params: { mode: 'default' } })
      }
    },
    onModalCancel: function(evt) {
      this.$bvModal.hide('modal-wizard')
    },
    onModalSave: function() {
      // Now use the information in the travelmodel and travelerData elements to add the event to the calendar and also to the SharePoint list
      // Need to change methods if editing
      // Also need to update the LastIndex of the work plan once the item is saved
      let event = []
      let start = moment(this.travelmodel.StartTime).format('YYYY-MM-DD[T]HH:MM:[00Z]')
      let end = moment(this.travelmodel.EndTime).format('YYYY-MM-DD[T]HH:MM:[00Z]')
      event.push({
        Subject: this.travelmodel.Subject,
        StartTime: start,
        EndTime: end,
        Status: this.travelmodel.Status,
        WorkPlan: this.travelmodel.WorkPlan,
        WorkPlanNumber: this.travelmodel.WorkPlanNumber,
        OriginalWorkPlanNumber: this.travelmodel.OriginalWorkPlanNumber,
        WorkPlanText: this.travelmodel.WorkPlanText,
        IndexNumber: this.travelmodel.IndexNumber,
        Company: this.travelmodel.Company,
        TravelFrom: this.travelmodel.TravelFrom,
        TravelTo: this.travelmodel.TravelTo,
        Travelers: this.travelmodel.Travelers, // this.travelerData,
        Sponsor: this.travelmodel.Sponsor,
        POCName: this.travelmodel.POCName,
        POCEmail: this.travelmodel.POCEmail,
        POCPhone: this.travelmodel.POCPhone,
        Comments: this.travelmodel.Comments,
        Clearance: this.travelmodel.Clearance,
        VisitRequest: this.travelmodel.VisitRequest,
        EstimatedCost: this.travelmodel.EstimatedCost,
        TripReport: isNullOrUndefined(this.reportdigest) ? 'EXISTS' : this.travelmodel.TripReport,
        etag: this.travelmodel.etag,
        uri: this.travelmodel.uri
      })
      this.selectedtrip = event
      if (this.editing) {
        // Has a trip report been selected? If so, we need to take care of uploading that or skip if none selected.
        // TODO: Was there an existing trip report already? Do we need to replace it?
        if (!isNullOrUndefined(this.fileSelected) && !isNullOrUndefined(this.reportdigest)) {
          // if a file is selected, the assumption is that this is a new trip report
          // need a report digest if we don't already have one
          vm.uploadTripReport(vm.fileSelected, vm.buffer, vm.reportdigest).then(function(response) {
            console.log('FILE UPLOADED RESPONSE: ' + response)
            // need to get the trip report file and update it's travel index number and title
            // need to then submit the updates to the travel request
            let itemlink = response.data.d.ListItemAllFields.__deferred.uri
            // set the item link so that we can get it later
            vm.reportlink = itemlink
            let item = vm.getReportItem(itemlink)
            item.then(function(response) {
              // now we have the file item object and can then proceed to update it
              console.log('GET FILE RESPONSE: ' + response)
              console.log('INDEX: ' + vm.travelmodel.IndexNumber)
              let updateitem = vm.updateReportItem(response.data.d.__metadata).then(function() {
                // there is no response object on an update
                // save travel request
                event[0].TripReport = server + '/TripReports/' + vm.fileSelected
                event[0].ReportFile = vm.fileSelected
                event[0].Status = 'ReportFiled'
                Travel.dispatch('editTrip', event).then(function() {
                  /* vm.$bvModal.hide('modal-wizard') */
                  // console.log(event[0].WorkPlanNumber + ', ' + event[0].OriginalWorkPlanNumber)
                  if (event[0].WorkPlanNumber !== event[0].OriginalWorkPlanNumber) {
                    // The workplan was changed! So, update the travel index on the workplan. NOTE: This will cause a loss of some travel indexes
                    // This loss of index would abandon the old travel index numnber to the new one, but there is no way to back out of the old index.
                    let payload = {}
                    payload.uri = vm.workplanuri
                    payload.etag = vm.workplanetag
                    payload.index = vm.newindex
                    Workplan.dispatch('updateIndex', payload).then(function(response) {
                      // console.log('UPDATED LAST INDEX:' + response)
                      vm.$bvModal.hide('modal-wizard')
                    })
                  } else {
                    vm.$bvModal.hide('modal-wizard')
                  }
                })
              })
            })
          })
        } else {
          // No trip report so just update the travel request
          Travel.dispatch('editTrip', event).then(function() {
            vm.$bvModal.hide('modal-wizard')
            if (event[0].WorkPlanNumber !== event[0].OriginalWorkPlanNumber) {
              // The workplan was changed! So, update the travel index on the workplan. NOTE: This will cause a loss of some travel indexes
              // This loss of index would abandon the old travel index numnber to the new one, but there is no way to back out of the old index.
              let payload = {}
              payload.uri = vm.workplanuri
              payload.etag = vm.workplanetag
              payload.index = vm.newindex
              Workplan.dispatch('updateIndex', payload).then(function(response) {
                // console.log('UPDATED LAST INDEX:' + response)
              })
            }
          })
        }
      } else {
        this.$refs.TravelCalendar.addEvent(event)
        // now push this to the data model to save to sharepoint
        Travel.dispatch('addTrip', event).then(function(response) {
          // the id of the added item is now in the response object!
          let id = response.data.d.Id
          vm.resetTravelModel()
          vm.$bvModal.hide('modal-wizard')
          // validate if email needs to be sent
          if (vm.emailRequired) {
            Travel.dispatch('sendEmail', id).then(function() {
              console.log('EMAIL SENT TO SECURITY')
            })
          }
          // update workplan index
          let payload = {}
          payload.uri = vm.workplanuri
          payload.etag = vm.workplanetag
          Workplan.dispatch('updateIndex', payload).then(function(response) {
            // console.log(response)
          })
        })
      }
    },
    onCellClick: function(args) {
      args.cancel = true
      if (this.moreevents) {
        // do nothing here
        this.moreevents = false
      } else {
        this.travelmodel.StartTime = moment(args.StartTime).format('YYYY-MM-DD')
        this.travelmodel.EndTime = moment(args.EndTime).format('YYYY-MM-DD')
        this.$bvModal.show('modal-wizard')
      }
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
      // remove any existing classes then add the new class
      args.element.classList.remove('travel-new')
      args.element.classList.remove('travel-approved')
      args.element.classList.remove('travel-report')
      args.element.classList.remove('travel-no-report')
      args.element.classList.add(c)
    },
    onEventClick(args) {
      args.cancel = true
      if (this.moreevents) {
        this.moreevents = false
      } else {
        this.editing = true
        this.fileSelected = !isNullOrUndefined(args.event.TripReport) ? args.event.TripReport : ''
        let giraffe = JSON.parse(args.event.Travelers)
        this.travelmodel.id = args.event.id
        this.travelmodel.Status = args.event.Status
        this.travelmodel.WorkPlan = args.event.WorkPlan
        this.travelmodel.WorkPlanNumber = args.event.WorkPlanNumber
        this.travelmodel.OriginalWorkPlanNumber = args.event.OriginalWorkPlanNumber
        this.travelmodel.WorkPlanText = args.event.WorkPlanText
        this.travelmodel.Company = args.event.Company
        this.travelmodel.Subject = args.event.Subject
        this.travelmodel.StartTime = moment(args.event.StartTime)
          .add(8, 'hours')
          .format('YYYY-MM-DD')
        this.travelmodel.EndTime = moment(args.event.EndTime)
          .add(8, 'hours')
          .format('YYYY-MM-DD')
        this.travelmodel.TravelFrom = args.event.TravelFrom
        this.travelmodel.TravelTo = args.event.TravelTo
        this.travelmodel.Sponsor = args.event.Sponsor
        this.travelmodel.POCName = args.event.POCName
        this.travelmodel.POCEmail = args.event.POCEmail
        this.travelmodel.POCPhone = args.event.POCPhone
        this.travelmodel.Comments = args.event.Comments
        this.travelmodel.Clearance = args.event.Clearance
        this.travelmodel.VisitRequest = args.event.VisitRequest
        this.travelmodel.EstimatedCost = args.event.EstimatedCost
        this.travelmodel.IndexNumber = args.event.IndexNumber
        this.travelmodel.TripReport = args.event.TripReport
        this.travelmodel.TripReportLink = args.event.TripReportLink
        this.travelmodel.Travelers = giraffe.length > 0 ? giraffe : []
        this.travelmodel.etag = args.event.etag
        this.travelmodel.uri = args.event.uri
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
              let valid = this.validateFirstTab()
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
    onWorkplanSelected: function() {
      let s = String(this.travelmodel.WorkPlanNumber)
      let t = this.workplans.filter(workplan => workplan.value == s)
      let wp = t[0].data
      wp = wp.split(', ')
      this.workplanuri = wp[4]
      this.workplanetag = wp[5]
      this.newindex = parseInt(wp[3]) + 1
      this.travelmodel.WorkPlan = t[0].data
      this.travelmodel.WorkPlanText = wp[1]
      this.travelmodel.IndexNumber = wp[0] + '-' + (parseInt(wp[3]) + 1)
    },
    getRef(text, idx) {
      return text + '_' + idx
    },
    ValidateMe: function(control) {
      let phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
      let emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
      let ret = false
      switch (control) {
        case 'Subject':
          ret = this.travelmodel.Subject.length > 2 ? true : false
          break

        case 'Company':
          ret = this.travelmodel.Company.length > 2 ? true : false
          break

        case 'WorkPlan':
          var val = this.travelmodel.WorkPlanNumber
          var good = false
          if (val.length > 0) {
            good = true
          }
          ret = good
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
    VisitRequest(checked) {
      this.travelmodel.VisitRequest = checked ? true : false
    },
    btnAddClick: function() {
      this.$bvModal.show('PersonnelModal')
    },
    onActionBegin(args) {
      console.log('ACTION BEGIN: ' + args.requestType + ', args' + args)
      switch (args.requestType) {
        case 'toolbarItemRendering':
          // something here
          break
      }
    },
    onActionComplete(args) {
      console.log('ACTION COMPLETE: ' + args.requestType + ', args' + args)
      switch (args.requestType) {
        case 'toolbarItemRendered':
          // something here
          break
      }
    },
    actionBegin(args) {
      switch (args.requestType) {
        case 'beginEdit':
          args.cancel = true
          vm.travelmodel.Travelers.push({
            firstName: args.rowData.FirstName,
            lastName: args.rowData.LastName,
            email: args.rowData.Email,
            phone: args.rowData.Phone
          })
          this.$bvModal.hide('PersonnelModal')
          break
      }
    },
    approveme: function(idx) {
      let payload = {}
      payload.id = this.approvalData[idx].Id
      payload.uri = this.approvalData[idx].uri
      payload.etag = this.approvalData[idx].etag
      let item = this.approvalItems.filter(trip => trip.Id == payload.id)
      let keep = this.approvalItems.filter(trip => trip.Id != payload.id)
      this.approvalItems = keep
      item[0].Status = 'Approved'
      item[0].class = 'travel-approved'
      this.$refs.TravelCalendar.saveEvent(item)
      // tell sharepoint to update the status to Approved
      this.$store.dispatch('database/travel/approveTravel', payload).then(function() {
        // perhaps do something here?
      })
    },
    deleteme: function(idx) {
      this.travelmodel.Travelers.splice(idx, 1)
    },
    async onFileSelect(args) {
      let response = await this.getFormDigest()
      vm.reportdigest = response.data.d.GetContextWebInformation.FormDigestValue
      let input = document.getElementById('EditTripReport')
      vm.fileSelected = args.filesData[0].name
      let buffer = vm.getFileBuffer(args.filesData[0].rawFile)
      buffer.then(function(buff) {
        vm.buffer = buff
      })
    },
    async uploadTripReport(name, buffer, digest) {
      let endpoint = String.format("{0}/_api/lists/getbytitle('{1}')/RootFolder/Files/Add(url='{2}',overwrite=true)", server, library, name)
      let data = buffer
      let headers = {
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': digest
      }
      try {
        const response = await axios({
          url: endpoint,
          method: 'POST',
          data: data,
          processData: false,
          async: false,
          headers: headers
        })
        return response
      } catch (error) {
        console.log('TravelService Error Adding Trip Report: ' + error)
      }
    },
    getFileBuffer(file) {
      let p = new Promise(function(resolve, reject) {
        var reader = new FileReader()
        reader.onloadend = function(e) {
          resolve(e.target.result)
        }
        reader.onerror = function(e) {
          reject(e.target.error)
        }
        reader.readAsArrayBuffer(file)
      })
      return p
    },
    getReportItem(uri) {
      return axios({
        method: 'GET',
        url: uri,
        headers: {
          Accept: 'application/json;odata=verbose'
        }
      })
    },
    updateReportItem(metadata) {
      let nwe = this.fileSelected.split('.')
      let endpoint = metadata.uri
      let headers = {
        'Content-Type': 'application/json;odata=verbose',
        Accept: 'application/json;odata=verbose',
        'X-RequestDigest': this.reportdigest,
        'X-HTTP-Method': 'MERGE',
        'If-Match': metadata.etag
      }
      let config = {
        headers: headers
      }
      let itemprops = {
        __metadata: { type: metadata.type },
        FileLeafRef: nwe[0],
        Title: nwe[0],
        IndexNumber: this.travelmodel.IndexNumber
      }
      return axios
        .post(endpoint, itemprops, config)
        .then(function(response) {
          return response
        })
        .catch(function(error) {
          console.log('Travel Error Updating Trip Report Data: ' + error)
        })
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      console.log('ROUTE CHANGE FROM TRAVELCALENDAR: ' + to + ', ' + from)
      this.mode = to.params.mode
      switch (this.mode) {
        case 'view':
          document.getElementById('PageTitle').innerHTML = ' -  View'
          this.selectedtrip = {} // clear any existing item
          var id = Number(this.$route.query.id)
          var trip = this.travel.filter(trip => trip.id == id)
          trip = trip[0]
          trip.Travelers = JSON.parse(trip.Travelers)
          this.selectedtrip = trip
          this.$bvModal.show('ViewModal')
          break

        case 'approval':
          document.getElementById('PageTitle').innerHTML = ' -  Approval'
          this.approvalItems = [] // clear any existing items
          var items = this.travel.filter(trip => trip.Status == 'New')
          for (let i = 0; i < items.length; i++) {
            let item = items[i]
            item.Travelers = JSON.parse(item.Travelers)
            this.approvalItems.push(item)
          }
          this.$bvModal.show('ApproveModal')
          break

        case 'new':
          document.getElementById('PageTitle').innerHTML = ' -  New Travel Request'
          this.$bvModal.show('modal-wizard')
          break

        case 'default':
          console.log('RELOADING TRIPS!')
          Travel.dispatch('getDigest')
          Travel.dispatch('getTRIPS').then(function() {
            vm.$options.interval = setInterval(vm.waitForEvents, 1000)
          })
          break

        case 'refresh':
          // do we actually get here?
          vm.$router.push({ name: 'Refresh', params: { action: 'travel' } })
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

.e-bigger.e-small .e-upload .e-file-select-wrap,
.e-upload .e-file-select-wrap {
  padding: 5px !important;
}

.e-bigger.e-small .e-upload .e-file-select-wrap .e-file-select,
.e-bigger.e-small .e-upload .e-file-select-wrap .e-file-select .e-uploader,
.e-upload .e-file-select-wrap .e-file-select,
.e-upload .e-file-select-wrap .e-file-select .e-uploader {
  display: unset !important;
  width: 0;
}

#ApprovalsTable table {
  border-collapse: collapse;
  border-spacing: 2px;
}

#ApprovalsTable table,
#ApprovalsTable th,
#ApprovalsTable td {
  border: 1px solid black !important;
}

#ApprovalsTable th,
#ApprovalsTable td {
  height: 20px;
}

#ApprovalsTable td {
  height: 20px;
  background-color: #ffffff !important;
  text-indent: 3px;
}

#TravelersTable table {
  border-collapse: collapse;
  border-spacing: 2px;
}

#TravelersTable table,
#TravelersTable th,
#TravelersTable td {
  border: 1px solid black !important;
}

#TravelersTable th,
#TravelersTable td {
  height: 20px;
}

#TravelersTable td {
  height: 20px;
  background-color: #ffffff !important;
  text-indent: 3px;
}

#ViewTable table {
  border-collapse: collapse;
}

#ViewTable table,
#ViewTable th,
#ViewTable td {
  border: 1px solid black !important;
}

#ViewTable th,
#ViewTable td {
  height: 20px;
}

#ViewTable td {
  height: 20px;
  background-color: #ffffff !important;
  text-indent: 3px;
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

#ViewModal .modal-title {
  margin: 0 auto;
  line-height: 1.5;
  width: 100%;
  text-align: center;
  color: #ffffff !important;
}

#ViewModal .close {
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
  color: #ffffff !important;
  background-color: black !important;
  opacity: 1;
}

#ApproveModal .modal-title {
  margin: 0 auto;
  line-height: 1.5;
  width: 100%;
  text-align: center;
  color: #ffffff !important;
}

#ApproveModal .close {
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
  color: #ffffff !important;
  background-color: black !important;
  opacity: 1;
}

.calendar {
  margin: 5px auto;
}

.form-control-travel {
  padding: 2px !important;
  font-size: 0.75rem !important;
  height: 20px !important;
}
</style>
