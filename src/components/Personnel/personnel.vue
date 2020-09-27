<!-- eslint-disable -->
<template>
  <b-container fluid class="contentHeight">
    <b-row ref="GridRow" class="contentHeight">
      <b-modal ref="FilterModal" id="FilterModal" size="sm" no-fade modal-class="animated bounceInLeft">
        <template v-slot:modal-title>Personnel Filter</template>
        <div>
          <ul id="ulFields">
            <li v-for="field in fields" :key="field">
              <div v-if="field.FieldName !== 'Version'">
                <ejs-checkbox :label="field.DisplayName" :checked="field.Visible" @change="showorhide" :value="field.FieldName"></ejs-checkbox>
                <b-button size="sm" class="actionbutton float-right" :class="field.Filter ? null : 'collapsed'" :aria-expanded="field.Filter ? 'true' : 'false'" :aria-controls="getRef('collapse', field.FieldName)" @click="field.Filter = !field.Filter">
                  <font-awesome-icon fas icon="filter" class="icon"></font-awesome-icon>
                </b-button>
                <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'Down' ? 'sorted' : ''" :id="getRef('sortdown', field.FieldName)" @click="sortdown(field.FieldName, field.Type)">
                  <font-awesome-icon fas icon="arrow-down" class="icon"></font-awesome-icon>
                </b-button>
                <b-button size="sm" class="actionbutton float-right" :class="field.Sort == 'Up' ? 'sorted' : ''" :id="getRef('sortup', field.FieldName)" @click="sortup(field.FieldName, field.Type)">
                  <font-awesome-icon fas icon="arrow-up" class="icon"></font-awesome-icon>
                </b-button>
                <b-collapse class="mt-1" :id="getRef('collapse', field.FieldName)" v-model="field.Filter">
                  <b-container fluid>
                    <b-row class="mb-1" v-if="field.Type !== 'Dropdown'">
                      <ejs-dropdownlist v-if="field.Type == 'Text'" v-model="field.Predicate" :dataSource="textpredicate" :fields="ddfields"></ejs-dropdownlist>
                      <ejs-dropdownlist v-if="field.Type == 'Date'" v-model="field.Predicate" :dataSource="datepredicate" :fields="ddfields"></ejs-dropdownlist>
                    </b-row>
                    <b-row v-else class="mb-1">
                      <ejs-dropdownlist v-if="field.DropdownSource === 'subet'" v-model="field.Selected" :dataSource="subet" :fields="ddfields"></ejs-dropdownlist>
                      <ejs-dropdownlist v-else-if="field.DropdownSource === 'companies'" v-model="field.Selected" :dataSource="companies" :fields="ddfields"></ejs-dropdownlist>
                      <ejs-dropdownlist v-else-if="field.DropdownSource === 'cacstatus'" v-model="field.Selected" :dataSource="cacstatus" :fields="ddfields"></ejs-dropdownlist>
                      <ejs-dropdownlist v-else-if="field.DropdownSource === 'formstatus'" v-model="field.Selected" :dataSource="formstatus" :fields="ddfields"></ejs-dropdownlist>
                      <ejs-dropdownlist v-else-if="field.DropdownSource === 'formtype'" v-model="field.Selected" :dataSource="formtype" :fields="ddfields"></ejs-dropdownlist>
                    </b-row>
                    <b-row class="mb-1">
                      <b-form-input class="filterform" v-if="field.Type == 'Text'" v-model="field.FilterValue"></b-form-input>
                      <ejs-datepicker v-if="field.Type == 'Date'" v-model="field.FilterValue"></ejs-datepicker>
                    </b-row>
                    <b-row v-if="field.Predicate == 'B'" class="mb-1">
                      <ejs-datepicker v-if="field.Type == 'Date'" v-model="field.FilterValue2"></ejs-datepicker>
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
              id="PersonnelGrid"
              ref="PersonnelGrid"
              :enablePersistence="false"
              :dataSource="filteredpersonnel"
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
                <e-column field="LastName" headerText="Last" textAlign="Left" width="100" :showInColumnChooser="false"></e-column>
                <e-column field="FirstName" headerText="First" width="100" :showInColumnChooser="false"></e-column>
                <e-column field="Middle" headerText="Middle" textAlign="Left" width="100"></e-column>
                <e-column field="Cadency" headerText="Cadency" textAlign="Left" width="100"></e-column>
                <e-column field="Position" headerText="Position" textAlign="Left" width="180"></e-column>
                <e-column field="Location" headerText="Location" textAlign="Left" width="150"></e-column>
                <e-column field="Email" headerText="Email" textAlign="Left" width="300"></e-column>
                <e-column field="Phone" headerText="Phone" textAlign="Left" width="100"></e-column>
                <e-column field="Company" headerText="Company" textAlign="Left" width="250"></e-column>
                <e-column field="SubET" headerText="Sub ET" textAlign="Left" width="100"></e-column>
                <e-column field="CACStatus" :visible="false" :showInColumnChooser="true" headerText="CAC Status" textAlign="Left" width="110"></e-column>
                <e-column field="CACRequestDate" :visible="false" :showInColumnChooser="true" headerText="CAC Req Date" textAlign="Left" width="180"></e-column>
                <e-column field="CACExpirationDate" :visible="false" :showInColumnChooser="true" headerText="CAC Exp Date" textAlign="Left" width="180"></e-column>
                <e-column field="SCIFormStatus" :visible="false" :showInColumnChooser="true" headerText="SCI Form Status" textAlign="Left" width="150"></e-column>
                <e-column field="SCIFormType" :visible="false" :showInColumnChooser="true" headerText="SCI Form Type" textAlign="Left" width="150"></e-column>
                <e-column field="SCIFormSubmitted" :visible="false" :showInColumnChooser="true" headerText="SCI Form Submitted" textAlign="Left" width="150"></e-column>
                <e-column field="PRDueDate" :visible="false" :showInColumnChooser="true" headerText="PR Due Date" textAlign="Left" width="180"></e-column>
                <e-column field="CEDate" :visible="false" :showInColumnChooser="true" headerText="CE Date" textAlign="Left" width="180"></e-column>
                <e-column field="Contact" headerText="Contact" :visible="false" textAlign="Left" width="70" :showInColumnChooser="false"></e-column>
                <e-column field="Active" headerText="Active" :visible="false" textAlign="Left" width="70" :showInColumnChooser="false"></e-column>
                <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true" :showInColumnChooser="false"></e-column>
                <e-column field="WPData" headerText="WPData" :visible="false" textAlign="Left" width="40" :showInColumnChooser="false"></e-column>
              </e-columns>
            </ejs-grid>
          </div>
        </b-row>
      </b-col>
    </b-row>
    <b-modal id="EditModal" ref="EditModal" size="xl" centered>
      <template v-slot:modal-title>Edit Details For {{ rowData.FirstName + ' ' + rowData.LastName }}</template>
      <b-container fluid>
        <p v-if="isSubcontractor">{{ rowData.ModDeniedReason }}</p>
        <table id="EditTable" class="personneltable">
          <tbody>
            <tr class="bg-info text-white">
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle</th>
              <th>Cadency (SR, JR, etc)</th>
              <th>Location</th>
              <th>Company</th>
            </tr>
            <tr class="text-white">
              <td><input class="e-input" type="text" v-model="rowData.LastName" /><p v-if="showOldData" class="text-info">Original Value: {{ oldData.LastName }}</p></td>
              <td><input class="e-input" type="text" v-model="rowData.FirstName" /><p v-if="showOldData" class="text-info">Original Value: {{ oldData.FirstName }}</p></td>
              <td><input class="e-input" type="text" v-model="rowData.Middle" /><p v-if="showOldData" class="text-info">Original Value: {{ oldData.Middle }}</p></td>
              <td><input class="e-input" type="text" v-model="rowData.Cadency" /><p v-if="showOldData" class="text-info">Original Value: {{ oldData.Cadency }}</p></td>
              <td><input class="e-input" type="text" v-model="rowData.Location" /><p v-if="showOldData" class="text-info">Original Value: {{ oldData.Location }}</p></td>
              <td>
                <ejs-dropdownlist v-model="rowData.Company" :dataSource="companies"></ejs-dropdownlist>
                <p v-if="showOldData" class="text-info">Original Value: {{ oldData.Company }}</p>
                <!-- <input class="e-input" type="text" v-model="rowData.Company" /> -->
              </td>
            </tr>
            <tr class="bg-info text-white">
              <th colspan="2">Position</th>
              <th colspan="2">Email</th>
              <th>Phone</th>
              <th>SubET</th>
            </tr>
            <tr class="text-white">
              <td colspan="2"><input class="e-input" type="text" v-model="rowData.Position" /><p v-if="showOldData" class="text-info">Original Value: {{ oldData.Position }}</p></td>
              <td colspan="2"><input class="e-input" type="text" v-model="rowData.Email" /><p v-if="showOldData" class="text-info">Original Value: {{ oldData.Email }}</p></td>
              <td><input class="e-input" type="text" v-model="rowData.Phone" /><p v-if="showOldData" class="text-info">Original Value: {{ oldData.Phone }}</p></td>
              <td><ejs-dropdownlist v-model="rowData.SubET" :dataSource="subet" :fields="ddfields"></ejs-dropdownlist><p v-if="showOldData" class="text-info">Original Value: {{ oldData.SubET }}</p></td>
            </tr>
            <tr class="bg-info text-white">
              <th colspan="2" title="CAC Status">CAC Status</th>
              <th colspan="2" title="CAC Request Date">CAC Req Date</th>
              <th colspan="2" title="CAC Expiration Date">CAC Exp Date</th>
            </tr>
            <tr class="text-white">
              <td colspan="2"><ejs-dropdownlist v-model="rowData.CACStatus" :dataSource="cacstatus" :fields="ddfields"></ejs-dropdownlist><p v-if="showOldData" class="text-info">Original Value: {{ oldData.CACStatus }}</p></td>
              <td colspan="2"><ejs-datepicker v-model="rowData.CACRequestDate"></ejs-datepicker><p v-if="showOldData" class="text-info">Original Value: {{ oldData.CACRequestDate }}</p></td>
              <td colspan="2"><ejs-datepicker v-model="rowData.CACExpirationDate" :placeholder="waterMark"></ejs-datepicker><p v-if="showOldData" class="text-info">Original Value: {{ oldData.CACExpirationDate }}</p></td>
            </tr>
            <tr class="bg-info text-white">
              <th colspan="2" title="SCI Form Status">SCI Form Status</th>
              <th colspan="2" title="SCI Form Type">SCI Form Type</th>
              <th colspan="2" title="SCI Form Submitted">SCI Form Submiited</th>
            </tr>
            <tr class="text-white">
              <td colspan="2"><ejs-dropdownlist v-model="rowData.SCIFormStatus" :dataSource="formstatus" :fields="ddfields"></ejs-dropdownlist><p v-if="showOldData" class="text-info">Original Value: {{ oldData.SCIFormStatus }}</p></td>
              <td colspan="2"><ejs-dropdownlist v-model="rowData.SCIFormType" :dataSource="formtype" :fields="ddfields"></ejs-dropdownlist><p v-if="showOldData" class="text-info">Original Value: {{ oldData.SCIFormType }}</p></td>
              <td colspan="2"><ejs-datepicker v-model="rowData.SCIFormSubmitted" :placeholder="waterMark"></ejs-datepicker><p v-if="showOldData" class="text-info">Original Value: {{ oldData.SCIFormSubmitted }}</p></td>
            </tr>
            <tr class="bg-info text-white">
              <th colspan="3" title="PR Due Date">PR Due Date</th>
              <th colspan="3" title="CE Date">CE Date</th>
            </tr>
            <tr class="text-white">
              <td colspan="3"><ejs-datepicker v-model="rowData.PRDueDate" :placeholder="waterMark"></ejs-datepicker><p v-if="showOldData" class="text-info">Original Value: {{ oldData.PRDueDate }}</p></td>
              <td colspan="3"><ejs-datepicker v-model="rowData.CEDate" :placeholder="waterMark"></ejs-datepicker><p v-if="showOldData" class="text-info">Original Value: {{ oldData.CEDate }}</p></td>
            </tr>
            <tr class="bg-info text-white text-center">
              <td colspan="6"><b>Work Plans</b></td>
            </tr>
            <tr>
              <td colspan="6">
                <b-table id="WPTable" ref="WPTable" v-model="WPData" :items="Plans" :fields="WPFields" style="table-layout: fixed;">
                  <template v-slot:cell(actions)="data">
                    <button size="sm" class="actionbutton" @click="deleteme(data.index)" title="Delete It">
                      <font-awesome-icon far icon="trash-alt" class="icon" :style="{ color: 'red' }"></font-awesome-icon>
                    </button>
                  </template>
                  <template v-slot:cell(Workplan)="data">
                    <ejs-dropdownlist v-model="WPData[data.index].Workplan" :dataSource="workplans" :fields="ddfields2" :id="getRef('Workplan', data.index)" @change="changewp"></ejs-dropdownlist>
                  </template>
                  <template v-slot:cell(PercentSupport)="data">
                    <ejs-dropdownlist v-model="WPData[data.index].PercentSupport" :dataSource="support" :fields="ddfields"></ejs-dropdownlist>
                  </template>
                </b-table>
                <button size="sm" @click="btnAddClick" variant="success">Add Work Plan</button>
              </td>
            </tr>
          </tbody>
        </table>
      </b-container>
      <template v-slot:modal-footer>
        <div id="editModalButtons" v-show="!approvalOnly" class="editModalButtons">
          <b-button variant="secondary" size="sm" @click="editClose">Close</b-button><b-button variant="primary" size="sm" @click="editOk">OK</b-button>
        </div>
        <div id="EditPersonnelButtons" v-show="!showDenial" class="editModalButtons">
          <b-button v-if="isWPManager" size="sm" @click="showDenial = !showDenial" variant="secondary">Deny</b-button><b-button v-if="isWPManager" size="sm" @click="btnApproveClick" variant="primary">Approve</b-button>
        </div>
        <div id="wpmDenial" v-show="showDenial" class="editModalButtons">
          Reason: <textarea id="DeniedReason"></textarea>
          <b-button size="sm" @click="showDenial = !showDenial" variant="secondary">Cancel</b-button>
          <b-button size="sm" @click="btnDenyClick" class="btn-success" variant="primary">Submit</b-button>
        </div>
      </template>
    </b-modal>
    <b-modal id="NewModal" ref="NewModal" size="xl" centered @ok="newOk">
      <template v-slot:modal-title>Add New User</template>
      <div class="container-fluid">
        <table id="NewTable" class="personneltable">
          <tbody>
            <tr class="bg-warning text-white">
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle</th>
              <th>Company</th>
            </tr>
            <tr>
              <td>
                <input class="e-input" type="text" v-model="newData.LastName" />
              </td>
              <td>
                <input class="e-input" type="text" v-model="newData.FirstName" />
              </td>
              <td>
                <input class="e-input" type="text" v-model="newData.Middle" />
              </td>
              <td>
                <ejs-dropdownlist v-model="newData.Company" :dataSource="companies"></ejs-dropdownlist>
              </td>
            </tr>
            <tr class="bg-warning text-white">
              <th colspan="2">Email</th>
              <th colspan="2">Phone</th>
            </tr>
            <tr>
              <td colspan="2">
                <input class="e-input" type="text" v-model="newData.Email" />
              </td>
              <td colspan="2">
                <input class="e-input" type="text" v-model="newData.Phone" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import Vue from 'vue'
import User from '@/models/User'
import Personnel from '@/models/Personnel'
import Workplan from '@/models/WorkPlan'
import Company from '@/models/Company'
import { Page, Edit, Toolbar, VirtualScroll, ExcelExport, DetailRow } from '@syncfusion/ej2-vue-grids'

let vm = null

export default {
  name: 'personnel',
  props: {
    mode: {
      type: String,
      default: 'default'
    },
    id: {
      type: Number
    }
  },
  errorCaptured(err, vm, info) {
    const notification = {
      type: 'danger',
      title: 'Error in personnel.vue ' + err,
      message: info,
      push: true
    }
    this.$store.dispatch('notification/add', notification, { root: true })
  },
  computed: {
    personnel() {
      return Personnel.getters('allPersonnel')
    },
    loaded() {
      return Personnel.getters('Loaded')
    },
    workplans() {
      return Workplan.getters('DropDown')
    },
    managers() {
      return Workplan.getters('Managers')
    },
    appversion() {
      return User.getters('AppVersion')
    },
    isWPManager() {
      return User.getters('isWPManager')
    },
    isDeveloper() {
      return User.getters('isDeveloper')
    },
    isSubcontractor() {
      return User.getters('isSubcontractor')
    },
    companies() {
      return Company.getters('DropDown')
    },
    user() {
      return User.getters('CurrentUser')
    }
  },
  data: function() {
    return {
      waterMark: 'Select a date',
      showDenial: false,
      showOldData: false,
      approvalOnly: false,
      sortfield: '',
      sortdir: '',
      filteredpersonnel: [],
      PersonnelId: 0,
      data: [],
      filters: {},
      height: '100%',
      fields: [
        {
          FieldName: 'Version',
          Value: null
        },
        {
          FieldName: 'LastName',
          Visible: true,
          DisplayName: 'Last',
          Filter: false,
          Type: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'FirstName',
          Visible: true,
          DisplayName: 'First',
          Filter: false,
          Type: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Middle',
          Visible: true,
          DisplayName: 'Middle',
          Filter: false,
          Type: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Cadency',
          Visible: true,
          DisplayName: 'Cadency',
          Filter: false,
          Type: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Position',
          Visible: true,
          DisplayName: 'Position',
          Filter: false,
          Type: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Location',
          Visible: true,
          DisplayName: 'Location',
          Filter: false,
          Type: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Email',
          Visible: true,
          DisplayName: 'Email',
          Filter: false,
          Type: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Phone',
          Visible: true,
          DisplayName: 'Phone',
          Filter: false,
          Type: 'Text',
          Predicate: 'S',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'Company',
          Visible: true,
          DisplayName: 'Company',
          Filter: false,
          Type: 'Dropdown',
          DropdownSource: 'companies',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'SubET',
          Visible: true,
          DisplayName: 'Sub ET',
          Filter: false,
          Type: 'Dropdown',
          DropdownSource: 'subet',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'CACStatus',
          Visible: false,
          DisplayName: 'CAC Status',
          Filter: false,
          Type: 'Dropdown',
          DropdownSource: 'cacstatus',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'CACRequestDate',
          Visible: false,
          DisplayName: 'CAC Req Date',
          Filter: false,
          Type: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        },
        {
          FieldName: 'CACExpirationDate',
          Visible: false,
          DisplayName: 'CAC Exp Date',
          Filter: false,
          Type: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        },
        {
          FieldName: 'SCIFormStatus',
          Visible: false,
          DisplayName: 'SCI Form Status',
          Filter: false,
          Type: 'Dropdown',
          DropdownSource: 'formstatus',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'SCIFormType',
          Visible: false,
          DisplayName: 'SCI Form Type',
          Filter: false,
          Type: 'Dropdown',
          DropdownSource: 'formtype',
          Selected: 'S',
          Predicate: 'E',
          FilterValue: '',
          Sort: ''
        },
        {
          FieldName: 'SCIFormSubmitted',
          Visible: false,
          DisplayName: 'SCI Form Submitted',
          Filter: false,
          Type: 'Date',
          Predicate: '',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        },
        {
          FieldName: 'PRDueDate',
          Visible: false,
          DisplayName: 'PR Due Date',
          Filter: false,
          Type: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
        },
        {
          FieldName: 'CEDate',
          Visible: false,
          DisplayName: 'CE Date',
          Filter: false,
          Type: 'Date',
          Predicate: 'S',
          FilterValue: '',
          FilterValue2: '',
          Sort: ''
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
      yesno: [
        { text: 'Yes', value: 'Yes' },
        { text: 'No', value: 'No' }
      ],
      subet: [
        { text: 'Select...', value: 'S' },
        { text: 'N/A', value: 'N/A' },
        { text: 'Existing', value: 'Existing' },
        { text: 'Required', value: 'Required' },
        { text: 'Terminated', value: 'Terminated' }
      ],
      cacstatus: [
        { text: 'Select...', value: 'S' },
        { text: 'N/A', value: 'N/A' },
        { text: 'CACI Review', value: 'CACI Review' },
        { text: 'Requested', value: 'Requested' },
        { text: 'Pending Info', value: 'Pending Info' },
        { text: 'Return Pending', value: 'Return Pending' },
        { text: 'Returned', value: 'Returned' },
        { text: 'Renewed', value: 'Renewed' },
        { text: 'Issued', value: 'Issued' },
        { text: 'Disposition-Transferred', value: 'Disposition-Transferred' },
        { text: 'Non F3I-2 CAC', value: 'Non F3I-2 CAC' },
        { text: 'Issuance Cancelled ', value: 'Issuance Cancelled ' }
      ],
      formstatus: [
        { text: 'Select...', value: 'S' },
        { text: 'CACI Review', value: 'CACI Review' },
        { text: 'Not Required', value: 'Not Required' },
        { text: 'Pending Info', value: 'Pending Info' },
        { text: 'Submitted', value: 'Submitted' },
        { text: 'Debrief Notification Submitted', value: 'Debrief Notification Submitted' },
        { text: 'SSO Processed', value: 'SSO Processed' },
        { text: 'Disposition-TIS', value: 'Disposition-TIS' },
        { text: 'Disposition-Debriefed', value: 'Disposition-Debriefed' }
      ],
      formtype: [
        { text: 'Select...', value: 'S' },
        { text: 'N/A', value: 'N/A' },
        { text: 'Nomination', value: 'Nomination' },
        { text: 'Transfer', value: 'Transfer' }
      ],
      support: [
        { text: '100%', value: 1 },
        { text: '75%', value: 0.75 },
        { text: '50%', value: 0.5 },
        { text: '25%', value: 0.25 },
        { text: '0%', value: 0 }
      ],
      WPFields: [
        { key: 'actions', label: 'Action', thClass: 'bg-warning text-white text-center px40' },
        { key: 'Workplan', label: 'Workplan', thClass: 'bg-warning text-white text-center px300' },
        { key: 'PercentSupport', label: 'Percent Support', thClass: 'bg-warning text-white text-center px200' }
      ],
      pageSettings: { pageSize: 30 },
      editSettings: { allowEditing: true, allowAdding: true, allowDeleting: false, mode: 'Dialog' },
      sortSettings: { columns: [{ field: 'LastName', direction: 'Ascending' }] },
      filterSettings: { type: 'Menu' },
      toolbar: ['Add', 'Edit', 'Print', 'Search', 'ExcelExport'],
      WPData: [
        {
          Workplan: '',
          WorkplanNumber: '',
          WorkplanTitle: '',
          PersonnelId: '0',
          PercentSupport: 100
        }
      ],
      Plans: [
        {
          Workplan: '',
          WorkplanNumber: '',
          WorkplanTitle: '',
          PersonnelId: '0',
          PercentSupport: 100
        }
      ],
      rowData: {},
      oldData: {},
      newData: {
        LastName: '',
        FirstName: '',
        Middle: '',
        Company: '',
        Email: ''
      },
      detailTemplate: function() {
        return {
          template: Vue.component('detailTemplate', {
            template: `
              <b-table-simple class="detailtable">
                <b-thead>
                  <b-tr>
                    <b-td>Work Plan</b-td>
                    <b-td>Percent Support</b-td>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr v-for="wp in pwps" :key="wp">
                    <b-td>{{wp.WorkplanNumber}} {{wp.WorkplanTitle}}</b-td>
                    <b-td>{{wp.PercentSupport * 100}}</b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>`,
            data: function() {
              return {
                data: {}
              }
            },
            methods: {},
            computed: {
              pwps() {
                return JSON.parse(this.data.WPData)
              }
            }
          })
        }
      }
    }
  },
  mounted: function() {
    vm = this
    const notification = {
      type: 'info',
      title: 'Getting Data',
      message: 'Getting Workplans and Personnel. Please wait...',
      push: false
    }
    this.$store.dispatch('notification/add', notification, { root: true })
    Personnel.dispatch('getDigest')
    Workplan.dispatch('getWorkplans').then(function() {
      Personnel.dispatch('getPersonnel').then(function() {
        vm.$options.interval = setInterval(vm.waitForPeople, 1000)
      })
    })
    if (this.mode === 'edit') {
      // Don't show all of the records until after the form is submitted
      this.approvalOnly = true
      this.PersonnelId = this.id
      Workplan.dispatch('getWorkplans').then(() => {
        Personnel.dispatch('getPersonnelAllValuesById', this.id).then(async person => {
          let modData = {}
          if (person[0].Modification && person[0].Modification.length > 0) {
            modData = JSON.parse(person[0].Modification)
            modData.uri = person[0].uri
            modData.etag = person[0].etag
            modData.Id = person[0].Id
            vm.oldData = person[0]
            vm.showOldData = true
          } else {
            modData = person[0]
          }
          vm.editRow(modData)
        })
      })
    }
  },
  methods: {
    waitForPeople: function() {
      if (this.personnel && this.personnel.length > 0) {
        clearInterval(this.$options.interval)
        this.filteredpersonnel = this.personnel // set initial filter to all
        // load any saved filters
        this.loadfilters()
        switch (this.mode) {
          case 'onboarding':
            document.getElementById('PageTitle').innerHTML = ' -  Onboarding'
            this.$bvModal.show('NewModal')
            break
          case 'default':
            document.getElementById('PageTitle').innerHTML = ' -  Reports'
            break
        }
      }
    },
    getRef: function(text, idx) {
      return text + '_' + idx
    },
    toolbarClick: function(args) {
      switch (args.item.id) {
        case 'PersonnelGrid_excelexport':
          this.$refs['PersonnelGrid'].excelExport()
          break

        case 'PersonnelGrid_print':
          this.$refs['PersonnelGrid'].print()
          break
      }
    },
    ToggleFilters() {
      this.$refs['FilterModal'].toggle('#ShowFilters')
    },
    onModalHide: function() {
      console.log('MODAL HIDE: ' + this.mode)
      vm.$router.push({ name: 'Refresh', params: { action: 'personnel' } })
    },
    actionBegin(args) {
      switch (args.requestType) {
        case 'beginEdit':
          // args.rowData contains the data for the row. Place this data in our edit form and we can change it and then update the row and also SharePoint
          args.cancel = true
          this.PersonnelId = args.rowData.Id
          this.editRow(args.rowData)
          break
        case 'add':
          args.cancel = true
          this.$bvModal.show('NewModal')
          break
      }
    },
    actionComplete(args) {
      if (args.requestType == 'columnstate') {
        this.$refs['PersonnelGrid'].autoFitColumns()
      }
      if (args.requestType == 'refresh') {
        let h1 = 0
        let h2 = this.$refs.PersonnelGrid.$el.children[7].children[0].clientHeight
        h1 = Math.floor(h2 / 20)
        this.pageSettings.pageSize = h1
        this.$refs.PersonnelGrid.pageSettings = { pageSize: h1 }
      }
    },
    dataBound: function() {
      this.$refs.PersonnelGrid.autoFitColumns()
    },
    editRow: function(data) {
      console.log('TEST POINT DATA CHECK A: ' + data.WPData)
      if (data.WPData && data.WPData.length > 0) {
        this.Plans = JSON.parse(data.WPData)
      }
      this.$bvModal.show('EditModal')
      this.rowData = data
    },
    editOk: async function() {
      console.log('LENGTH: ' + this.WPData[0].Workplan.length)
      if (this.WPData[0].Workplan.length > 3) {
        this.rowData.WPData = JSON.stringify(this.WPData)
      }
      //TODO: Remove isDeveloper before moving to Testing
      if (this.isSubcontractor) {
        let data = {
          Modification: JSON.stringify(this.rowData),
          uri: this.rowData.uri,
          etag: this.rowData.etag,
          Id: this.rowData.Id
        }
        await Personnel.dispatch('editPerson', data).then(async () => {
          if (this.WPData.length > 0) {
            let managerEmails = []
            for (var n = 0; n <= this.WPData.length; n++) {
              let manager = await Workplan.dispatch('getManagerByWPNumber', this.WPData[n])
              console.log(`Manager: ${JSON.stringify(manager)}`)
              if (manager[0]) {
                managerEmails.push(manager[0]['Manager']['EMail'])
              }
            }
            data.WPManagerEmails = managerEmails
          }
          await Personnel.dispatch('editSubEmail', data, 'edit').then(() => {
            const notification = {
              type: 'info',
              title: 'Information',
              message: 'A Workplan Manager will review your submission.',
              push: true
            }
            this.$store.dispatch('notification/add', notification, { root: true })
            vm.hideme('EditModal', 'refresh')
          })
        })
      } else {
        Personnel.dispatch('editPerson', this.rowData).then(function() {
          vm.hideme('EditModal', 'refresh')
        })
      }
    },
    editClose: () => {
      vm.hideme('EditModal', 'refresh')
    },
    newOk: async function() {
      if (this.isSubcontractor) {
        let data = {
          Modification: JSON.stringify(this.newData)
        }
        let results = await Personnel.dispatch('addSub', data)
        if (this.WPData.length > 0) {
          let managerEmails = []
          for (var n = 0; n <= vm.WPData.length; n++) {
            let manager = await Workplan.dispatch('getManagerByWPNumber', this.WPData[n])
            console.log(`Manager: ${JSON.stringify(manager)}`)
            if (manager[0]) {
              managerEmails.push(manager[0]['Manager']['EMail'])
            }
          }
          results.WPManagerEmails = managerEmails
        }
        await Personnel.dispatch('newSubEmail', results).then(() => {
          vm.hideme('NewModal')
          const notification = {
            type: 'info',
            title: 'Information',
            message: 'A Workplan Manager will review your submission.',
            push: true
          }
          vm.$store.dispatch('notification/add', notification, { root: true })
        }) //sendemail with results id
      } else {
        Personnel.dispatch('addPerson', this.newData).then(function() {
          vm.hideme('NewModal', 'refresh')
        })
      }
    },
    btnAddClick: () => {
      this.Plans.push({
        Workplan: '',
        WorkplanNumber: '',
        WorkplanTitle: '',
        PersonnelId: '',
        PercentSupport: ''
      })
    },
    btnApproveClick: () => {
      vm.rowData.ModDeniedReason = ''
      vm.rowData.Modification = '' // Remove previous Modification Data
      Personnel.dispatch('editPerson', vm.rowData).then(function() {
        vm.approvalOnly = false
        vm.hideme('EditModal', 'refresh')
      })
    },
    btnDenyClick: () => {
      // TO DO: Post Reason to ModDeniedReason
      let denyData = {
        Modification: vm.oldData.Modification,
        ModDeniedReason: document.querySelector('#DeniedReason').value,
        id: vm.oldData.Id,
        uri: vm.oldData.uri,
        etag: vm.oldData.etag
      }
      Personnel.dispatch('editPerson', denyData).then(() => {
        vm.approvalOnly = false
        vm.hideme('EditModal', 'refresh')
      })
    },
    changewp: function(e) {
      var id = String(e.element.id)
      var index = id.split('_')[1]
      var tval = e.itemData.data
      tval = tval.split(', ')
      this.WPData[index].WorkplanNumber = tval[0]
      this.WPData[index].WorkplanTitle = tval[1]
      this.WPData[index].PersonnelId = this.PersonnelId
    },
    deleteme: function(index) {
      this.WPData.splice(index, 1)
      this.Plans.splice(index, 1)
    },
    hideme: function(modal, action) {
      vm.$bvModal.hide(modal)
      if (action == 'refresh') {
        vm.$router.push({ name: 'Refresh', params: { action: 'personnel' } })
      }
    },
    sortup: function(e, t) {
      // ascending
      var p = this.filteredpersonnel
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
      this.filteredpersonnel = p
      this.$refs.PersonnelGrid.refresh()
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
      var p = this.filteredpersonnel
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
      this.filteredpersonnel = p
      this.$refs.PersonnelGrid.refresh()
      for (var i = 0; i < this.fields.length; i++) {
        if (this.fields[i].FieldName == e) {
          console.log('SORT DOWN: ' + e)
          this.fields[i].Sort = 'Down'
        } else {
          this.fields[i].Sort = ''
        }
      }
    },
    showorhide: function(e) {
      var checked = e.checked
      // var fieldname = e.event.target.value
      var displayname = e.event.target.labels[0].innerText
      if (checked) {
        for (let i = 1; i < vm.fields.length; i++) {
          if (vm.fields[i].DisplayName == displayname) {
            vm.fields[i].Visible = true
          }
        }
        this.$refs.PersonnelGrid.showColumns([displayname])
        this.$refs.PersonnelGrid.autoFitColumns()
      } else {
        for (let i = 1; i < vm.fields.length; i++) {
          if (vm.fields[i].DisplayName == displayname) {
            vm.fields[i].Visible = false
          }
        }
        this.$refs.PersonnelGrid.hideColumns([displayname])
        this.$refs.PersonnelGrid.autoFitColumns()
      }
    },
    setfilter: function() {
      // always reset to all records then do all filters as they are selected.
      // this is a top down filter
      // loop through all the fields and filter the ones that have a predicate and filtervalue set
      var p = vm.personnel // set initial filter to all
      for (var i = 1; i < vm.fields.length; i++) {
        if (vm.fields[i].Sort !== '') {
          vm.sortfield = vm.fields[i].FieldName
        }
        if (vm.fields[i].Predicate !== 'S') {
          if (vm.fields[i].FilterValue !== '' || vm.fields[i].Selected !== 'S') {
            // determine what to filter based on predicate
            switch (vm.fields[i].Predicate) {
              case 'SW':
                // Starts With
                p = p.filter(person => Vue._.startsWith(person[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                break

              case 'EW':
                // Ends With
                p = p.filter(person => Vue._.endsWith(person[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                break

              case 'C':
                // Contains
                p = p.filter(person => Vue._.includes(person[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                break

              case 'E':
                // Equals
                if (vm.fields[i].Type == 'Dropdown') {
                  console.log('SETTING FILTER: ' + vm.fields[i].FieldName + ', TO: ' + vm.fields[i].Selected)
                  p = p.filter(person => Vue._.isEqual(person[vm.fields[i].FieldName], vm.fields[i].Selected))
                } else {
                  p = p.filter(person => Vue._.isEqual(person[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                }
                break

              case 'NE':
                // Not Equals
                p = p.filter(person => Vue._.without(person[vm.fields[i].FieldName], vm.fields[i].FilterValue))
                break

              case 'GT':
                // Greater Than
                p = p.filter(person => moment(person[vm.fields[i].FieldName]).isAfter(moment(vm.fields[i].FilterValue)))
                break

              case 'LT':
                // Less Than
                p = p.filter(person => moment(vm.fields[i].FilterValue).isAfter(moment(person[vm.fields[i].FieldName])))
                break

              case 'B':
                // Between
                p = p.filter(person => moment(person[vm.fields[i].FieldName]).isBetween(moment(vm.fields[i].FilterValue), moment(vm.fields[i].FilterValue2)))
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
        if (vm.fields[i].Visible) {
          vm.$refs.PersonnelGrid.showColumns(vm.fields[i].DisplayName)
          vm.$refs.PersonnelGrid.autoFitColumns()
        } else {
          vm.$refs.PersonnelGrid.hideColumns(vm.fields[i].DisplayName)
          vm.$refs.PersonnelGrid.autoFitColumns()
        }
      }
      vm.filteredpersonnel = p
    },
    clearfilter: function(e) {
      var f = String(e.target.id).split('_')[1]
      console.log('CLEARING FILTER: ' + f)
      for (var i = 1; i < vm.fields.length; i++) {
        if (vm.fields[i].FieldName == f) {
          vm.fields[i].Predicate = 'S'
          vm.fields[i].FilterValue = ''
          // vm.fields[i].Sort = ''
          if (vm.fields[i].Type == 'Date') {
            vm.fields[i].FilterValue2 = ''
          }
          if (vm.fields[i].Type == 'Dropdown') {
            vm.fields[i].Selected = 'S'
          }
        }
      }
      vm.setfilter()
    },
    clearfilters: function() {
      window.localStorage.removeItem('personnel')
      for (var i = 1; i < vm.fields.length; i++) {
        vm.fields[i].Predicate = 'S'
        vm.fields[i].FilterValue = ''
        vm.fields[i].Sort = ''
        if (vm.fields[i].Type == 'Date') {
          vm.fields[i].FilterValue2 = ''
        }
        if (vm.fields[i].Type == 'Dropdown') {
          vm.fields[i].Selected = 'S'
        }
      }
      vm.filteredpersonnel = vm.personnel
    },
    savefilters: function() {
      this.fields[0].Value = this.appversion
      window.localStorage.setItem('personnel', JSON.stringify(vm.fields))
    },
    loadfilters: function() {
      let f = String(window.localStorage.getItem('personnel'))
      if (f != 'null') {
        // here we will load the fields from local storage and test the version.
        // if the version matches the current app version then load the fields.
        // if not use the new fields from the file and alert the user that they need to rebuild their filters
        let flds = JSON.parse(f)
        let version = flds[0]['Value']
        if (version == this.appversion) {
          // ask the user if they want to apply the saved filters
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
                  if (this.fields[i].Visible) {
                    this.$refs.PersonnelGrid.showColumns(this.fields[i].DisplayName)
                    this.$refs.PersonnelGrid.autoFitColumns()
                  } else {
                    this.$refs.PersonnelGrid.hideColumns(this.fields[i].DisplayName)
                    this.$refs.PersonnelGrid.autoFitColumns()
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
              const notification = {
                type: 'danger',
                title: 'Error in personnel.vue loading filters',
                message: err,
                push: true
              }
              this.$store.dispatch('notification/add', notification, { root: true })
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
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.mode = to.params.mode
      switch (this.mode) {
        case 'onboarding':
          document.getElementById('PageTitle').innerHTML = ' -  Onboarding'
          this.$bvModal.show('NewModal')
          break
        case 'default':
          Personnel.dispatch('getPersonnel').then(function() {
            vm.$options.interval = setInterval(vm.waitForPeople, 1000)
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

.editModalButtons > button {
  margin-right: 0.5rem !important;
}

.editModalButtons > textarea {
  margin-right: 0.5rem !important;
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
