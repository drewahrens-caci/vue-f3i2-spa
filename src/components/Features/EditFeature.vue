<!-- eslint-disable -->
<template>
  <b-modal id="EditModal" ref="EditModal" size="xl" centered @ok="onOk">
    <template v-slot:modal-title>Edit Details For {{ rowData.Title }}</template>
    <b-container fluid>
      <table id="EditTable" class="featuretable">
        <tbody>
          <tr>
            <td colspan="6">Title</td>
          </tr>
          <tr>
            <td colspan="6"><input class="e-input" type="text" v-model="rowData.Title" /></td>
          </tr>
          <tr>
            <td colspan="2">Status</td>
            <td colspan="2">Priority</td>
            <td colspan="2">Category</td>
          </tr>
          <tr>
            <td colspan="2"><ejs-dropdownlist v-model="rowData.Status" :dataSource="status" :fields="ddfields"></ejs-dropdownlist></td>
            <td colspan="2"><ejs-dropdownlist v-model="rowData.Priority" :dataSource="priority" :fields="ddfields"></ejs-dropdownlist></td>
            <td colspan="2"><ejs-dropdownlist v-model="rowData.Category" :dataSource="category" :fields="ddfields"></ejs-dropdownlist></td>
          </tr>
          <tr>
            <td colspan="2">Effort</td>
            <td colspan="2">Due Date</td>
            <td colspan="2">% Complete</td>
          </tr>
          <tr>
            <td colspan="2"><ejs-dropdownlist v-model="rowData.Effort" :dataSource="effort" :fields="ddfields"></ejs-dropdownlist></td>
            <td colspan="2"><ejs-datepicker v-model="rowData.DueDate"></ejs-datepicker></td>
            <td colspan="2"><ejs-dropdownlist v-model="rowData.PercentComplete" :dataSource="percent" :fields="ddfields"></ejs-dropdownlist></td>
          </tr>
          <tr>
            <td colspan="4">Description</td>
            <td colspan="2">Assigned To</td>
          </tr>
          <tr>
            <td colspan="4">
              <ejs-richtexteditor ref="Comment" id="rteComment" v-model="rowData.Comment" height="200"></ejs-richtexteditor>
            </td>
            <td colspan="2"><ejs-dropdownlist v-model="rowData.AssignedTo" :dataSource="owners" :fields="ddfields"></ejs-dropdownlist></td>
          </tr>
          <tr>
            <td colspan="6">Comments</td>
          </tr>
          <tr>
            <td colspan="6">
              <ejs-richtexteditor ref="Comments" id="rteComments" v-model="rowData.Comments" height="400"></ejs-richtexteditor>
            </td>
          </tr>
        </tbody>
      </table>
    </b-container>
<!--     <template v-slot:footer>
      <em>Footer Slot</em>
    </template> -->
  </b-modal>
  </b-card>
</template>

<script>
/* eslint-disable */
import { EventBus } from '../../main'
import Feature from '@/models/Feature'
import User from '@/models/User'
import { Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table } from '@syncfusion/ej2-vue-richtexteditor'

let vm = null

export default {
  name: 'editfeature',
  props: {
    rowData: {
      type: Object,
      default: {}
    }
  },
  computed: {
    user() {
      return User.getters('CurrentUser')
    },
    userid() {
      return User.getters('CurrentUserId')
    }
  },
  data: function() {
    return {
      FeatureId: 0,
      // rowData: {},
      priority: [
        { text: 'Select...', value: 'S' },
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' }
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
    }
  },
  mounted: function() {
    Feature.dispatch('getDigest')
    // this.rowData = this.$router.currentRoute.params.rowData
    this.$bvModal.show('EditModal')
  },
  methods: {
    onCreate: function() { 
      EventBus.$on('refresh', this.refreshRte) 
    }, 
    refreshRte() { 
      this.$refs.Comment.refreshUI()
      this.$refs.Comments.refreshUI()
    },
    onOk: function(bvEvent) {
      bvEvent.preventDefault()
      // properly save the data bac to SharePoint and send the user back to the list of features
      consolde.log('TEST STOP: ' + rowData)
    },
    onClose: function() {
      this.$router.back()
    },
    onCancel: function() {
      this.$router.back()
    }
  },
  provide: {
    richtexteditor: [Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table]
  }
}
</script>

<style lang="scss" scoped></style>
