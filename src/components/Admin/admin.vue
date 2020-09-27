<template>
  <b-container fluid class="contentHeight p-0" id="MainContainer">
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
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">Subcontractor Actions</span>
              <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-0">
              <b-button ref="UpdateSubs" variant="success" @click="UpdateSubs">Update Subs</b-button>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">MSR Actions</span>
              <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-0">
              <b-button ref="createMSR" variant="success" @click="createMSRs">Create MSRs</b-button>
              <b-button ref="cloneMSRs" variant="warning" class="ml-1" @click="btnCloneMSRsClick">Clone MSRs</b-button>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="3"></b-col>
      <b-col cols="3">
        <b-card border-variant="success" text-variant="dark">
          <template v-slot:header>
            <h3 class="mb-0">
              <span class="ml-0">Developer Actions</span>
              <font-awesome-icon fas icon="user-shield" class="icon text-danger float-right ml-1"></font-awesome-icon>
            </h3>
          </template>
          <b-card-body>
            <b-row class="p-0 m-0">
              <b-button :disabled="travel.length <= 0" ref="UpdateTravel" variant="success" @click="UpdateTravel">Update Travelers</b-button>
              <b-button ref="InstallSecurity" variant="danger" @click="InstallSecurity" class="ml-1">Install Security</b-button>
              <!-- <b-button ref="btnPlayground" variant="success" @click="btnPlaygroundClick">Playground</b-button> -->
            </b-row>
            <!-- <b-row class="p-0 m-0">
              <b-form-input id="txtUserId" ref="txtUserId" v-model="UserId" placeholder="User Id"></b-form-input>
              <b-button ref="getUserInfo" variant="success" @click="getUserInfo" class="ml-1">Get User Info By Id</b-button>
            </b-row> -->
          </b-card-body>
        </b-card>
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
import Travel from '@/models/Travel'

let vm = null

export default {
  name: 'admin',
  props: {
    mode: {
      type: String,
      default: 'home'
    }
  },
  errorCaptured(err, vm, info) {
    const notification = {
      type: 'danger',
      title: 'Error in Admin Home ' + err,
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
    allpersonnel() {
      return Personnel.getters('allPersonnel')
    },
    allworkplans() {
      return Workplan.getters('allWorkplans')
    },
    travel() {
      return Travel.getters('allTravel')
    },
    appversion() {
      return User.getters('AppVersion')
    },
    isDeveloper() {
      return User.getters('isDeveloper')
    },
    isPCA() {
      return User.getters('isPCA')
    },
    isAdmin() {
      return User.getters('isSubcontractor')
    }
  },
  data: function() {
    return {
      UserId: null,
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
      selecteddata: null,
      ManagerEmail: '',
      cloneMSR: false,
      dataMap: []
    }
  },
  mounted: function() {
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {
      console.log('sp.js is loaded')
    })
    vm = this
    MSR.dispatch('getDigest')
    Travel.dispatch('getDigest')
    Travel.dispatch('getTRIPS')
    const notification = {
      type: 'info',
      title: 'Getting MSRs',
      message: 'Please Wait...',
      push: false
    }
    this.$store.dispatch('notification/add', notification, { root: true })
    Workplan.dispatch('getWorkplans').then(function() {
      MSR.dispatch('getMSRs').then(function() {
        vm.$options.interval = setInterval(vm.waitForMSRs, 1000)
      })
    })
  },
  beforeDestroy() {
    this.$store.dispatch('support/setLegendItems', [])
  },
  methods: {
    async getUserInfo() {
      let payload = {}
      payload.id = Number(this.UserId)
      let response = await User.dispatch('getUserById', payload)
      payload.login = response.data.d.LoginName
      response = await User.dispatch('getUserProfileFor', payload)
      console.log('User Profile Results: ' + response)
    },
    InstallSecurity() {
      var ctx = SP.ClientContext.get_current() // SP is SharePoint library and is expected to be loaded. SP object added to globals in package.json
      var uca
      uca = ctx.get_web().get_userCustomActions()
      ctx.load(uca)
      let url = 'portalsecurity.js'
      let sequence = 1010
      var action = uca.add()
      action.set_location('ScriptLink')
      action.set_title(url)
      action.set_scriptSrc('~site/SiteAssets/html/static/js/' + url)
      action.set_sequence(sequence)
      action.update()
      ctx.load(action)
      ctx.executeQueryAsync(
        function() {
          console.log('Install Succeeded.')
        },
        function(sender, args) {
          console.log('Install Failed: ' + args.get_message())
        }
      )
    },
    waitForMSRs: function() {
      if (this.loaded && this.workplansloaded) {
        clearInterval(this.$options.interval)
        // loop workplans to see what ones to create MSRs from
        for (let i = 0; i < this.allworkplans.length; i++) {
          if (this.$moment(this.allworkplans[i].POPEnd).isAfter(this.$moment())) {
            this.temp.push(this.allworkplans[i])
          }
        }
        if (console) {
          console.log('WAIT FOR MSR COMPLETE')
        }
        console.log(this.cloneMSR)
        if (this.cloneMSR) {
          this.cloneMSRs()
        }
      }
    },
    btnCloneMSRsClick: function() {
      this.cloneMSR = true
      this.UpdateSubs()
    },
    btnCreateMSRsClick: function() {
      this.busyTitle = 'Creating MSRs'
      this.busyMax = this.temp.length
      this.busyValue = 0
      this.$bvToast.show('busy-toast')
      this.createMSRs()
    },
    async createMSRs() {
      // TODO: Let the user know we are doing something
      this.busyTitle = 'Creating MSRs'
      this.busyMax = this.temp.length
      this.busyValue = 0
      this.$bvToast.show('busy-toast')
      if (this.temp.length > 0) {
        // still have workplans so keep going
        let item = this.temp.pop()
        this.busyValue = this.busyMax - this.temp.length
        // create the item
        await MSR.dispatch('createMSR', item)
        // will wait for the item
        // console.log('CREATE MSR RESPONSE: ' + response)
        // call the function again to keep going until all msrs are created.
        this.createMSRs()
      } else {
        // Done creating items so go get them for the grid
        // TODO: Let the user know we are done. Do we just refresh the page here or just show them the new MSR's?
        this.$bvToast.hide('busy-toast')
        MSR.dispatch('getMSRs').then(function() {
          vm.$options.interval = setInterval(vm.waitForMSRs, 1000)
        })
      }
    },
    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    },
    async cloneMSRs() {
      // First create new MSRS and add to the data Map
      let currentMSRs = await MSR.dispatch('getMSRs')
      await vm.asyncForEach(currentMSRs, async item => {
        console.log(item.WorkplanNumber)
        let workplan = await Workplan.dispatch('getPOPByWPNumber', item.WorkplanNumber)
        // validate that MSR needs to be created by checking the Workplan PO month
        if (new Date(workplan[0].POPEnd).valueOf() > Date.now()) {
          let data = { originalId: item }
          var newMSR = {
            Number: item.WorkplanNumber,
            Title: item.WorkplanTitle,
            Funding: item.Funding,
            Staffing: item.Staffing,
            CostReport: item.CostReport,
            TravelAccomplished: item.TravelAccomplished,
            TravelPlanned: item.TravelPlanned,
            Deliverables: item.Deliverables
          }
          await MSR.dispatch('createMSR', newMSR).then(results => {
            // will wait for the item
            data.newId = results.data.d
            vm.dataMap.push(data)
          })
        }
      })
      await this.cloneSubLists()
    },
    async cloneSubLists() {
      // Then loop through the data map adding each of the relaed content
      if (vm.dataMap.length > 0) {
        vm.busyTitle = 'Cloning MSRs'
        vm.busyMax = vm.dataMap.length
        vm.busyValue = 0
        vm.$bvToast.show('busy-toast')
        var n = vm.dataMap.length
        await vm.asyncForEach(vm.dataMap, async data => {
          vm.busyValue = vm.busyMax - n
          console.log(`Processing ${n}: ${data}`)
          await vm.duplicateAccomplishment(data)
          await vm.duplicateAssumption(data)
          await vm.duplicateDeliverables(data)
          await vm.duplicateOpportunities(data)
          await vm.duplicatePlans(data)
          await vm.duplicateRisks(data)
          n--
        })
        this.cloneMSR = false
        this.$bvToast.hide('busy-toast')
        // Done creating items so go get them for the grid
        MSR.dispatch('getMSRs').then(function() {
          vm.$options.interval = setInterval(vm.waitForMSRs, 1000)
        })
      }
    },
    UpdateSubs: async function() {
      // loop through the workplans and then loop through the personnel list like in the manning page to get all unique subs for each workplan.
      // let users know this is happening
      this.temp = []
      this.busyTitle = 'Geting Workplan and Personnel Data'
      this.busyMax = 100
      this.$bvToast.show('busy-toast')
      Workplan.dispatch('getDigest')
      await Workplan.dispatch('getWorkplans')
      this.busyValue = 50
      await Personnel.dispatch('getPersonnel')
      this.busyMax = this.allworkplans.length
      this.busyTitle = 'Creating Data For Subs'
      for (let a = 0; a < this.allworkplans.length; a++) {
        this.busyValue = a
        let subs = '' // String(this.allworkplans[a]['Subs']) // will contain the current list of subs on this workplan
        // if (subs == 'null') { subs = '' }
        let wpn = this.allworkplans[a]['Number']
        // loop through the personnel list and get the company name and workplan for each user.
        // test the workplan and then test that the company is in the sub list and if not add it
        for (let b = 0; b < this.allpersonnel.length; b++) {
          let company = String(this.allpersonnel[b]['Company'])
          company = company.trim()
          // we do not need CACI employees as they are not subs for the MSR so we can skip them
          if (company != 'CACI') {
            // console.log('COMPANY: ' + company)
            let wpdata = this.allpersonnel[b]['WPData']
            if (wpdata != null || wpdata.length > 5) {
              try {
                wpdata = JSON.parse(wpdata)
                // need to loop wpdata to see if this user supports this workplan
                for (let c = 0; c < wpdata.length; c++) {
                  let ps = Number(wpdata[c]['PercentSupport'])
                  // console.log('PERCENT SUPPORT: ' + wpdata.PercentSupport)
                  if (ps > 0) {
                    if (wpdata[c]['WorkplanNumber'] == wpn) {
                      if (!Vue._.includes(subs, company)) {
                        if (subs.length > 0) {
                          subs = subs + ', ' + company
                        } else {
                          subs = company
                        }
                      }
                    }
                  }
                }
              } catch (err) {
                // console.log(err)
              }
            } else {
              // console.log('NO WORKPLAN DATA FOR: ' + this.allpersonnel[b]['LastName'])
            }
          }
        }
        // subs should now have all subs that support the workplan so then go update the data in SharePoint
        if (console) {
          console.log('SUBS LENGTH: ' + subs.length)
        }
        if (subs.length > 0) {
          this.temp.push({
            Number: wpn,
            etag: this.allworkplans[a]['etag'],
            uri: this.allworkplans[a]['uri'],
            id: this.allworkplans[a]['Id'],
            Subs: subs
          })
        }
      }
      // We now have worplan numbers with their respective subs so go update the workplans with that data
      this.busyValue = 0
      this.busyMax = this.temp.length
      this.busyTitle = 'Updating Workplan Sub Data'
      await this.UpdateWorkplans()
    },
    async UpdateWorkplans() {
      if (this.temp.length > 0) {
        // still have workplans so keep going
        let item = this.temp.pop()
        this.busyValue += 1
        // create the item
        await Workplan.dispatch('saveWorkplanSubs', item)
        // will wait for the item
        // call the function again to keep going until all msrs are created.
        this.UpdateWorkplans()
      } else {
        // Done creating items
        this.$bvToast.hide('busy-toast')
        Workplan.dispatch('getWorkplans').then(function() {
          // reload workplans
          MSR.dispatch('getMSRs').then(function() {
            vm.$options.interval = setInterval(vm.waitForMSRs, 1000)
          })
        })
      }
    },
    async UpdateTravel() {
      // have to create the 'TravelersText' for all travel with travelers
      const notification = {
        type: 'danger',
        title: 'Getting Travel',
        message: 'Please Wait...',
        push: false
      }
      this.$store.dispatch('notification/add', notification, { root: true })
      this.$store.dispatch('support/addActivity', '<div class="bg-danger text-white">Admin UpdateTravel completed. ' + this.travel.length + '</div>')
      for (let i = 0; i < this.travel.length; i++) {
        let e = []
        e.push(this.travel[i])
        Travel.dispatch('editTraveler', e)
      }
    }
  }
}
</script>

<style lang="scss">
.msr-dialog {
  max-width: 1600px !important;
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
.controls {
  height: 50px;
  flex: 0 0 auto;
  border: 1px solid green;
}
.list {
  flex: 1;
  border: 1px solid red;
}
</style>
