<template>
  <b-container fluid class="contentHeight p-0" id="MainContainer">
    <b-modal
      id="MsrForm"
      ref="MsrForm"
      @close="onModalHide"
      no-close-on-esc
      no-close-on-backdrop
      hide-backdrop
      :title="viewTitle"
      hide-footer
      modal-class="msr-modal"
      dialog-class="msr-dialog"
      content-class="msr-content"
      body-class="msr-body"
      v-model="showForm"
      scrollable
      @shown="onModalShown"
    >
      <template v-slot:default>
        <msr-form :msrdata="selecteddata" :height="formheight" v-on:close="setClosed"></msr-form>
      </template>
    </b-modal>
    <b-modal id="DistributionModal" ref="DistributionModal" size="xl" centered @ok="newDistribution">
      <template v-slot:modal-title>Add Distribution</template>
      <div class="container-fluid">
        <table id="NewTable" class="personneltable">
          <tbody>
            <tr class="bg-warning text-white">
              <th>Title</th>
              <th>Name</th>
              <th>Organization</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Email</th>
            </tr>
            <tr>
              <td><input class="e-input" type="text" v-model="distribution.Title" /></td>
              <td><input class="e-input" type="text" v-model="distribution.Name" /></td>
              <td><input class="e-input" type="text" v-model="distribution.Organization" /></td>
              <td><input class="e-input" type="text" v-model="distribution.Phone" /></td>
              <td><input class="e-input" type="text" v-model="distribution.Location" /></td>
              <td><input class="e-input" type="text" v-model="distribution.Email" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
    <b-toast id="busy-toast" variant="warning" solid no-auto-hide>
      <template v-slot:toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="#ff0000" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">{{ busyTitle }}</strong>
        </div>
      </template>
      <b-progress :variant="busyVariant" :value="busyValue" :max="busyMax" show-progress animated></b-progress>
    </b-toast>
    <b-row ref="MainRow" class="contentHeight">
      <b-col cols="12">
        <ejs-grid id="MSRGrid" ref="MSRGrid" :dataSource="msrs" :allowPaging="true" :pageSettings="pageSettings" :dataBound="dataBound" rowHeight="20" height="100%" :actionComplete="actionComplete" v-on:request-distribution="onRequestDistributionA">
          <e-columns v-on:request-distribution="onRequestDistributionB">
            <e-column headerText="Actions" textAlign="Left" width="300" :template="ActionsTemplate" v-on:request-distribution="onRequestDistributionC"></e-column>
            <e-column field="WPMReview" headerText="WPM Review" width="100"></e-column>
            <e-column field="QAReview" headerText="QA Review" width="100"></e-column>
            <e-column field="PCAReview" headerText="PCA Review" width="100"></e-column>
            <e-column field="WorkplanNumber" headerText="Number" width="100"></e-column>
            <e-column field="WorkplanTitle" headerText="Title" textAlign="Left" width="200"></e-column>
            <e-column field="Status" headerText="Status" width="100"></e-column>
            <e-column field="Month" headerText="Month" textAlign="Left" width="50"></e-column>
            <e-column field="Year" headerText="Year" textAlign="Left" width="50"></e-column>
            <e-column field="Id" headerText="Id" :visible="false" textAlign="Left" width="40" :isPrimaryKey="true"></e-column>
            <e-column field="ManagerEmail" :visible="false" textAlign="Left" width="40"></e-column>
            <e-column field="uri" :visible="false" textAlign="Left" width="40"></e-column>
            <e-column field="etag" :visible="false" textAlign="Left" width="40"></e-column>
          </e-columns>
        </ejs-grid>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
import MSR from '@/models/MSR'
import User from '@/models/User'
import Workplan from '@/models/WorkPlan'
import Personnel from '@/models/Personnel'
import { Page, DetailRow } from '@syncfusion/ej2-vue-grids'
import MsrForm from '@/components/MSR/msrform.vue'

let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
let vm = null

export default {
  name: 'msrhome',
  components: {
    MsrForm
  },
  errorCaptured(err, vm, info) {
    const notification = {
      type: 'danger',
      title: 'Error in MSR Home ' + err,
      message: info,
      push: true
    }
    this.$store.dispatch('notification/add', notification, { root: true })
  },
  computed: {
    userloaded() {
      return User.getters('Loaded')
    },
    loaded() {
      return MSR.getters('Loaded')
    },
    workplansloaded() {
      return Workplan.getters('Loaded')
    },
    personnelloaded() {
      return Personnel.getters('Loaded')
    },
    user() {
      return User.getters('CurrentUser')
    },
    userid() {
      return User.getters('CurrentUserId')
    },
    allmsrs() {
      return MSR.getters('allMSRs')
    },
    currentmsrs() {
      return MSR.getters('CurrentMSRs')
    },
    allpersonnel() {
      // TODO: Do we need to keep this? Used for getting subs for workplans
      return Personnel.getters('allPersonnel')
    },
    allworkplans() {
      return Workplan.getters('allWorkplans')
    },
    appversion() {
      return User.getters('AppVersion')
    },
    isPM() {
      return User.getters('isPM')
    },
    isDeveloper() {
      return User.getters('isDeveloper')
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
    isSubcontractor() {
      return User.getters('isSubcontractor')
    },
    rect() {
      return this.$store.state.support.contentrect
    }
  },
  data: function() {
    return {
      pageSettings: { pageSize: 30 },
      formheight: 0,
      WorkplanNumber: '',
      viewTitle: 'MSR View for WP ',
      busyTitle: 'Getting Data. Please Wait.',
      busyMax: 100,
      busyValue: 0,
      busyVariant: 'success',
      Company: '',
      Email: '',
      Month: '',
      Year: 2020,
      msrs: [],
      workplans: [],
      temp: [],
      count: 0,
      total: 0,
      showForm: false,
      selecteddata: null,
      distribution: {
        WorkplanNumber: null,
        Title: '',
        Name: '',
        Organization: '',
        Phone: '',
        Location: '',
        Email: '',
        From: '',
        To: '',
        Id: null
      },
      ManagerEmail: '',
      ActionsTemplate: function() {
        return {
          template: Vue.component('columnTemplate', {
            template: `
            <div>
              <b-button variant="success" class="actionbutton" @click="view(data)" title="View">
                <font-awesome-icon far icon="eye" class="icon"></font-awesome-icon> View MSR
              </b-button>
              <b-button v-if="isSubcontractor || isDeveloper" class="actionbutton ml-1" @click="distribution(data)" title="Request Distribution">
                <font-awesome-icon far icon="mail-bulk" class="icon"></font-awesome-icon> Request Distribution
              </b-button>
            </div>`,
            data: function() {
              return {
                data: {}
              }
            },
            computed: {
              isPM() {
                return User.getters('isPM')
              },
              isDeveloper() {
                return User.getters('isDeveloper')
              },
              isWPManager() {
                return User.getters('isWPManager')
              },
              isSubcontractor() {
                return User.getters('isSubcontractor')
              }
            },
            methods: {
              view: function(data) {
                vm.selecteddata = data
                vm.viewTitle = 'MSR View for WP ' + vm.selecteddata.WorkplanNumber
                vm.showForm = true
                // vm.$bvModal.show('MsrForm')
              },
              distribution: function(data) {
                vm.onRequestDistribution(data)
              }
            }
          })
        }
      }
    }
  },
  mounted: function() {
    vm = this
    MSR.dispatch('getDigest')
    this.$store.dispatch('support/setLegendItems', [])
    vm.$nextTick(function() {
      let email = vm.user[0].Email
      vm.Email = email
      vm.Company = vm.user[0].Company
      let m = this.$moment().get('month')
      vm.Month = months[m]
      vm.Year = this.$moment().year()
      const notification = {
        type: 'info',
        title: 'Getting MSRs',
        message: 'Please Wait...',
        push: false
      }
      this.$store.dispatch('notification/add', notification, { root: true })
      MSR.dispatch('getMSRs').then(function() {
        vm.$options.interval = setInterval(vm.waitForMSRs, 1000)
      })
    })
  },
  beforeDestroy() {
    this.$store.dispatch('support/setLegendItems', [])
  },
  methods: {
    waitForMSRs: function() {
      if (this.loaded) {
        clearInterval(this.$options.interval)
        if (vm.isSubcontractor) {
          vm.$store.dispatch('support/addActivity', '<div class="bg-primary">msrhome-waitForMSRs Step 1 isSubcontractor: ' + vm.$moment().format() + '</div>')
          let hasWorkplans = false
          if (vm.user[0].WPData && vm.user[0].WPData.length > 2) {
            let wpdata = JSON.parse(vm.user[0].WPData)
            for (let i = 0; i < wpdata.length; i++) {
              let ps = Number(wpdata[i]['PercentSupport'])
              vm.$store.dispatch('support/addActivity', '<div class="bg-primary">msrhome-waitForMSRs Step 2 WPDATA Loop Percent Support: ' + ps + '</div>')
              if (ps > 0) {
                hasWorkplans = true
                let wpn = wpdata[i]['WorkplanNumber']
                // loop through msrs and assign based on wp
                vm.$store.dispatch('support/addActivity', '<div class="bg-primary">msrhome-waitForMSRs Step 3 Checking all msrs for match: ' + vm.$moment().format() + '</div>')
                for (let j = 0; j < vm.allmsrs.length; j++) {
                  if (vm.allmsrs[j]['WorkplanNumber'] === wpn) {
                    vm.msrs.push(vm.allmsrs[j])
                  }
                }
              }
            }
          }
          if (hasWorkplans === false) {
            const notification = {
              type: 'danger',
              title: 'Error in MSR Home',
              message: 'You are not assigned any MSRs',
              push: true
            }
            this.$store.dispatch('notification/add', notification, { root: true })
          }
        } else {
          vm.$store.dispatch('support/addActivity', '<div class="bg-primary">msrhome-waitForMSRs Step 4: ' + vm.$moment().format() + '</div>')
          // User is something other than Subcontractor
          // WPManagers only see their workplans so we need to go get those. Owners and PCA's will see all
          if (vm.isWPManager) {
            // console.log('SHOULD SEE ONLY MSRS FOR WORKPLANS YOU ARE MANAGER OF!')
            // go get workplans for this wpmanager
            let localmsrs = []
            for (let i = 0; i < vm.allworkplans.length; i++) {
              if (vm.allworkplans[i]['ManagerId'] == vm.userid) {
                let wpn = vm.allworkplans[i]['Number']
                console.log('WORKPLAN: ' + wpn)
                // loop through msrs and assign based on wp
                for (let j = 0; j < vm.allmsrs.length; j++) {
                  if (vm.allmsrs[j]['WorkplanNumber'] == wpn) {
                    localmsrs.push(vm.allmsrs[j])
                  }
                }
              }
            }
            localmsrs = Vue._.orderBy(localmsrs, 'WorkplanNumber', 'asc')
            vm.msrs = localmsrs
          } else {
            vm.msrs = Vue._.orderBy(vm.allmsrs, 'WorkplanNumber', 'asc')
            const notification = {
              type: 'success',
              title: 'All Selected MSRs Loaded',
              message: 'A total of ' + vm.msrs.length + ' MSR(s) have been loaded.',
              push: true
            }
            this.$store.dispatch('notification/add', notification, { root: true })
          }
        }
      }
    },
    onModalHide: function() {
      this.showForm = false
    },
    setClosed: function() {
      this.showForm = false
    },
    onRequestDistribution: function(data) {
      // if (console) { console.log('DISTRIBUTION REQUEST A: ' + data) }
      // let user know we are sending the request
      this.busyValue = 0
      this.busyMax = this.allworkplans.length
      this.busyTitle = 'Sending Distribution Request'
      this.$bvToast.show('busy-toast')
      let wpn = data.WorkplanNumber
      if (console) {
        console.log('WPN OF DIST REQ: ' + wpn)
      }
      for (let i = 0; i < this.allworkplans.length; i++) {
        this.busyValue = i
        if (this.allworkplans[i]['Number'] == wpn) {
          this.ManagerEmail = this.allworkplans[i]['ManagerEmail']
        }
      }
      // construct payload to send email
      this.distribution.WorkplanNumber = wpn
      this.distribution.From = this.Email
      this.distribution.To = this.ManagerEmail
      this.distribution.Id = data.Id
      this.$bvModal.show('DistributionModal')
    },
    newDistribution: function() {
      MSR.dispatch('sendDistributionRequest', this.distribution).then(function() {
        vm.$bvModal.hide('DistributionModal')
        vm.$bvToast.hide('busy-toast')
      })
    },
    actionComplete(args) {
      if (args.requestType == 'columnstate') {
        this.$refs.MSRGrid.autoFitColumns()
      }
      if (args.requestType == 'refresh') {
        let h1 = 0
        let h2 = this.$refs.MSRGrid.$el.children[2].children[0].clientHeight // cildren[2] matches .e-gridconent
        h1 = Math.floor(h2 / 20)
        this.pageSettings.pageSize = h1
        this.$refs.MSRGrid.pageSettings = { pageSize: h1 }
        this.$refs.MSRGrid.autoFitColumns()
      }
    },
    dataBound: function() {
      this.$refs.MSRGrid.autoFitColumns()
    },
    onModalShown: function() {
      this.formheight = this.$refs['MsrForm'].$refs['body'].clientHeight
      let popup = document.getElementsByClassName('msr-dialog')
      popup[0].style.position = 'absolute'
      popup[0].style.left = vm.rect.left + 'px'
      popup[0].style.top = vm.rect.top + 'px'
      popup[0].style.width = vm.rect.width + 'px'
      popup[0].style.height = vm.rect.height + 'px'
    }
  },
  provide: {
    grid: [Page, DetailRow]
  }
}
</script>

<style lang="scss">
.msr-dialog {
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
}
.msr-content {
  min-height: calc(100vh - 3.5rem);
}
.msr-body {
  padding: 0 1rem !important;
  overflow-y: scroll;
}
.flexcontainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
.list {
  flex: 1;
  border: 1px solid red;
}
</style>
