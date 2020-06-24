<template>
  <b-container fluid class="p-0 contentHeight flexcontainer" id="MSRInput">
    <div class="row messagerow m-0">
      <div class="col-12">
        <b-alert :variant="messagevariant" show>{{ message }}</b-alert>
      </div>
    </div>
    <div class="row tabrow">
      <b-card no-body>
        <b-tabs ref="dashboardtabs" class="tabArea" card v-model="tabIndex" @activate-tab="onTabSelected">
          <b-tab class="mtab" active>
            <template slot="title"
              ><font-awesome-icon fas icon="cog" class="icon"></font-awesome-icon>
              Information
            </template>
            <b-form>
              <div class="row">
                <div class="col-4">WorkPlan</div>
                <div class="col-4">Company</div>
                <div class="col-4">Email</div>
              </div>
              <div class="row">
                <div class="col-4">
                  <b-form-select class="form-control-sm" v-model="msrmodel.WorkplanNumber" :options="workplans" ref="WorkPlan"></b-form-select>
                </div>
                <div class="col-4">
                  <b-form-input class="form-control-sm" v-model="msrmodel.Company" ref="Company"></b-form-input>
                </div>
                <div class="col-4">
                  <b-form-input class="form-control-sm" v-model="msrmodel.Email" ref="Email"></b-form-input>
                </div>
              </div>
            </b-form>
          </b-tab>
          <b-tab class="mtab Section1">
            <template slot="title"
              ><font-awesome-icon fas icon="search-dollar" class="icon"></font-awesome-icon>
              Funding and Staffing Summary
            </template>
            <b-form class="Section1Form">
              <div class="row">
                <div class="col-12">
                  <ejs-richtexteditor ref="rteSection1" id="rteSection1" class="rtesection" v-model="msrmodel.Section1" :toolbarSettings="toolbarSettings" :imageUploadSuccess="onImageUploadSuccess" :insertImageSettings="insertImageSettings"></ejs-richtexteditor>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <b-form-checkbox ref="Section1PrivateCB" v-model="msrmodel.Section1Private" value="Yes" unchecked-value="No" @input="onPrivateChanged">Mark As Private</b-form-checkbox>
                </div>
              </div>
            </b-form>
          </b-tab>
          <b-tab class="mtab Section2">
            <template slot="title"
              ><font-awesome-icon fas icon="bus-alt" class="icon"></font-awesome-icon>
              Travel
            </template>
            <b-form class="Section2Form">
              <div class="row">
                <div class="col-12">
                  <ejs-richtexteditor ref="rteSection2" id="rteSection2" class="rtesection" v-model="msrmodel.Section2" :toolbarSettings="toolbarSettings" :imageUploadSuccess="onImageUploadSuccess" :insertImageSettings="insertImageSettings"></ejs-richtexteditor>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <b-form-checkbox ref="Section2PrivateCB" v-model="msrmodel.Section2Private" value="Yes" unchecked-value="No" @input="onPrivateChanged">Mark As Private</b-form-checkbox>
                </div>
              </div>
            </b-form>
          </b-tab>
          <b-tab class="mtab Section3">
            <template slot="title"
              ><font-awesome-icon fas icon="tasks" class="icon"></font-awesome-icon>
              Accomplishments
            </template>
            <b-form class="Section3Form">
              <div class="row">
                <div class="col-12">
                  <ejs-richtexteditor ref="rteSection3" id="rteSection3" class="rtesection" v-model="msrmodel.Section3" :toolbarSettings="toolbarSettings" :imageUploadSuccess="onImageUploadSuccess" :insertImageSettings="insertImageSettings"></ejs-richtexteditor>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <b-form-checkbox ref="Section3PrivateCB" v-model="msrmodel.Section3Private" value="Yes" unchecked-value="No" @input="onPrivateChanged">Mark As Private</b-form-checkbox>
                </div>
              </div>
            </b-form>
          </b-tab>
          <b-tab class="mtab Section4">
            <template slot="title"
              ><font-awesome-icon fas icon="ruler-combined" class="icon"></font-awesome-icon>
              Plans
            </template>
            <b-form class="Section4Form">
              <div class="row">
                <div class="col-12">
                  <ejs-richtexteditor ref="rteSection4" id="rteSection4" class="rtesection" v-model="msrmodel.Section4" :toolbarSettings="toolbarSettings" :imageUploadSuccess="onImageUploadSuccess" :insertImageSettings="insertImageSettings"></ejs-richtexteditor>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <b-form-checkbox ref="Section4PrivateCB" v-model="msrmodel.Section4Private" value="Yes" unchecked-value="No" @input="onPrivateChanged">Mark As Private</b-form-checkbox>
                </div>
              </div>
            </b-form>
          </b-tab>
          <b-tab class="mtab Section5">
            <template slot="title"
              ><font-awesome-icon fas icon="microscope" class="icon"></font-awesome-icon>
              Assumptions, Risks, Opportunities
            </template>
            <b-form class="Section5Form">
              <div class="row">
                <div class="col-12">
                  <ejs-richtexteditor ref="rteSection5" id="rteSection5" class="rtesection" v-model="msrmodel.Section5" :toolbarSettings="toolbarSettings" :imageUploadSuccess="onImageUploadSuccess" :insertImageSettings="insertImageSettings"></ejs-richtexteditor>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <b-form-checkbox ref="Section5PrivateCB" v-model="msrmodel.Section5Private" value="Yes" unchecked-value="No" @input="onPrivateChanged">Mark As Private</b-form-checkbox>
                </div>
              </div>
            </b-form>
          </b-tab>
          <b-tab class="mtab Section6">
            <template slot="title"
              ><font-awesome-icon fas icon="truck" class="icon"></font-awesome-icon>
              Deliverables
            </template>
            <b-form class="Section6Form">
              <div class="row">
                <div class="col-12">
                  <ejs-richtexteditor ref="rteSection6" id="rteSection6" class="rtesection" v-model="msrmodel.Section6" :toolbarSettings="toolbarSettings" :imageUploadSuccess="onImageUploadSuccess" :insertImageSettings="insertImageSettings"></ejs-richtexteditor>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <b-form-checkbox ref="Section6PrivateCB" v-model="msrmodel.Section6Private" value="Yes" unchecked-value="No" @input="onPrivateChanged">Mark As Private</b-form-checkbox>
                </div>
              </div>
            </b-form>
          </b-tab>
          <b-tab class="mtab Section7">
            <template slot="title"
              ><font-awesome-icon fas icon="thumbs-up" class="icon"></font-awesome-icon>
              Distribution
            </template>
            <b-form class="Section7Form">
              <div class="row">
                <div class="col-12">
                  <ejs-richtexteditor ref="rteSection7" id="rteSection7" class="rtesection" v-model="msrmodel.Section7" :toolbarSettings="toolbarSettings" :imageUploadSuccess="onImageUploadSuccess" :insertImageSettings="insertImageSettings"></ejs-richtexteditor>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <b-form-checkbox ref="Section7PrivateCB" v-model="msrmodel.Section7Private" value="Yes" unchecked-value="No" @input="onPrivateChanged">Mark As Private</b-form-checkbox>
                </div>
              </div>
            </b-form>
          </b-tab>
          <b-tab class="mtab">
            <template slot="title"
              ><font-awesome-icon fas icon="traffic-light" class="icon"></font-awesome-icon>
              Summary
            </template>
            Under Construction
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
    <div class="row buttonrow">
      <div class="col-12 p-0 text-center">
        <b-button-group class="mt-2">
          <b-button variant="danger" ref="btnCancel" class="mr-2" @click="onModalCancel">Cancel</b-button>
          <b-button v-if="tabIndex > 0" ref="btnPrev" @click="tabIndex--">Previous</b-button>
          <b-button v-if="tabIndex < 8" ref="btnNext" @click="tabIndex++">Next</b-button>
          <b-button v-if="msrmodel.Email !== ''" ref="btnOk" class="ml-2" @click="onFormSave">Save Input</b-button>
          <b-button v-if="tabIndex == 8" variant="danger" ref="btnOk" class="ml-2" @click="onModalSubmit">Submit</b-button>
        </b-button-group>
      </div>
    </div>
  </b-container>
</template>

<script>
import Vue from 'vue'
import MSR from '@/models/MSR'
import User from '@/models/User'
import Workplan from '@/models/WorkPlan'
import Company from '@/models/Company'
import { RichTextEditorPlugin, Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table } from '@syncfusion/ej2-vue-richtexteditor'

Vue.use(RichTextEditorPlugin)

let vm = null

export default {
  name: 'msrinput',
  computed: {
    loaded() {
      return MSR.getters('Loaded')
    },
    companies() {
      return Company.getters('allCompanies')
    },
    user() {
      return User.getters('CurrentUser')
    },
    userid() {
      return User.getters('CurrentUserId')
    },
    allworkplans() {
      return Workplan.getters('DropDown')
    },
    appversion() {
      return User.getters('AppVersion')
    },
    isOwner() {
      return User.getters('isOwner')
    },
    isWPManager() {
      return User.getters('isWPManager')
    },
    isPCA() {
      return User.getters('isPCA')
    },
    isMSRInputter() {
      return User.getters('isMSRInputter')
    }
  },
  data: function() {
    return {
      insertImageSettings: {
        saveFormat: 'Base64'
      },
      toolbarSettings: {
        items: [
          'Bold',
          'Italic',
          'Underline',
          'StrikeThrough',
          'FontName',
          'FontSize',
          'FontColor',
          'BackgroundColor',
          'LowerCase',
          'UpperCase',
          '|',
          'Formats',
          'Alignments',
          'OrderedList',
          'UnorderedList',
          'Outdent',
          'Indent',
          '|',
          'CreateTable',
          'CreateLink',
          'Image',
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
      workplans: [],
      message: 'Welcome to your MSR Input. Please fill out accordingly.',
      messagevariant: 'success',
      msrmodel: {
        WorkplanNumber: '',
        Company: '',
        Email: '',
        Section1: '',
        Section1Private: '',
        Section2: '',
        Section2Private: '',
        Section3: '',
        Section3Private: '',
        Section4: '',
        Section4Private: '',
        Section5: '',
        Section5Private: '',
        Section6: '',
        Section6Private: '',
        Section7: '',
        Section7Private: ''
      }
    }
  },
  mounted: function() {
    vm = this
    MSR.dispatch('getDigest')
    let email = vm.user[0].Email
    vm.msrmodel.Email = email
    vm.msrmodel.Company = vm.user[0].Company
    // TODO: Will need to check role first because this will just be for inputters and perhaps a couple other roles
    // TODO: WP Managers should see their workplans: Could get this from the workplans list
    if (vm.isMSRInputter) {
      if (vm.user[0].WPData && vm.user[0].WPData.length > 2) {
        let wpdata = JSON.parse(vm.user[0].WPData)
        console.log('SETTING WPDATA: ' + wpdata + ', type: ' + typeof wpdata)
        for (let i = 0; i < wpdata.length; i++) {
          let ps = Number(wpdata[i]['PercentSupport'])
          console.log('PERCENT SUPPORT: ' + ps)
          if (ps > 0) {
            let txt = wpdata[i]['WorkplanNumber'] + ' ' + wpdata[i]['WorkplanTitle']
            console.log('WORKPLAN: ' + txt)
            vm.workplans.push({
              text: txt,
              value: wpdata[i]['WorkplanNumber']
            })
          }
        }
      } else {
        // TODO: User has no assigned workplans! What do we need to do here?
      }
    } else {
      // User is something other than MSRInputter
      // WPManagers only see their workplans so we need to go get those. Owners and PCA's will see all for now
      if (vm.isWPManager) {
        // go get workplans for this wpmanager
        let wp = []
        for (let i = 0; i < vm.allworkplans.length; i++) {
          if (vm.allworkplans[i]['ManagerId'] == vm.userid) {
            let txt = vm.allworkplans[i]['WorkplanNumber'] + ' ' + vm.allworkplans[i]['WorkplanTitle']
            console.log('WORKPLAN: ' + txt)
            wp.push({
              text: txt,
              value: vm.allworkplans[i]['WorkplanNumber']
            })
          }
        }
        vm.workplans = wp
      } else {
        let wp = []
        for (let i = 0; i < vm.allworkplans.length; i++) {
          let txt = vm.allworkplans[i]['WorkplanNumber'] + ' ' + vm.allworkplans[i]['WorkplanTitle']
          console.log('WORKPLAN: ' + txt)
          wp.push({
            text: txt,
            value: vm.allworkplans[i]['WorkplanNumber']
          })
        }
        vm.workplans = wp
      }
    }
  },
  methods: {
    onImageUploadSuccess: function(args) {
      if (args.e.currentTarget.getResponseHeader('name') !== null) {
        console.log('FILENAME: ' + args.e.currentTarget.getResponseHeader('name'))
      }
    },
    onFormSave: function() {
      // save the data
      MSR.dispatch('addMSRInput', vm.msrmodel).then(function() {
        console.log('DATA ADDED')
      })
    }
  },
  provide: {
    richtexteditor: [Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table]
  }
}
</script>

<style lang="scss">
.form-control-sm {
  height: calc(1.5em + 0.5rem + 2px) !important;
  padding: 0.25rem 0.5rem !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  border: 1px solid black !important;
}
.flexcontainer {
  display: flex;
  flex-direction: column;
  flex-flow: column nowrap;
}
.messagerow {
  height: 50px;
}
.buttonrow {
  height: 50px;
}
.tabrow {
  flex: auto;
}
.card {
  width: 100%;
}
.e-richtexteditor .e-rte-content .e-content,
.e-richtexteditor .e-source-content .e-content {
  min-height: calc(100vh - 350px) !important;
}
</style>
