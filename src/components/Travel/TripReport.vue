<template>
  <b-modal v-model="Show" ref="TripReport" centered hide-footer no-fade modal-class="animated bounceInLeft" @close="onModalHide">
    <template v-slot:modal-title>Upload Trip Report</template>
    <table class="mt-1">
      <tbody>
        <tr class="text-center bg-warning text-white">
          <th>Upload Trip Report [This replaces any existing trip report]</th>
        </tr>
        <tr>
          <td><ejs-uploader id="fileupload" name="UploadFiles" :selected="onFileSelect" :multiple="false"></ejs-uploader></td>
        </tr>
        <tr>
          <td>
            <div class="col p-0 text-right">
              <b-button-group class="mt-2">
                <b-button variant="success" ref="btnOk" class="ml-2" @click="onModalSave">Submit</b-button>
              </b-button-group>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </b-modal>
</template>

<script>
import Travel from '@/models/Travel'
import User from '@/models/User'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let library = SPCI.webAbsoluteUrl + '/TripReports/'

let vm = null

export default {
  name: 'TripReport',
  props: {
    mode: {
      type: String,
      default: 'default'
    },
    TripId: {
      type: Number
    },
    Show: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    triploaded() {
      return Travel.getters('triploaded')
    },
    selectedtrip() {
      return Travel.getters('selectedtrip')
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
    }
  },
  mounted: function() {
    vm = this
  },
  data: function() {
    return {
      fileSelected: null,
      fileBuffer: null,
      fileName: null,
      travelmodel: {
        id: 0,
        Status: '',
        TripReport: '',
        IndexNumber: '',
        etag: '',
        uri: ''
      }
    }
  },
  methods: {
    waitForTrip: function() {
      // Waits for the travel item to load
      if (this.triploaded) {
        clearInterval(this.$options.interval)
        this.travelmodel.id = this.selectedtrip.id
        this.travelmodel.Status = this.selectedtrip.Status
        this.travelmodel.TripReport = this.selectedtrip.TripReport
        this.travelmodel.IndexNumber = this.selectedtrip.IndexNumber
        this.travelmodel.etag = this.selectedtrip.etag
        this.travelmodel.uri = this.selectedtrip.uri
      }
    },
    onModalHide: function() {
      this.$emit('close') // emit close event which will be picked up by parent traveltracker.vue
    },
    async onModalSave() {
      // perform upload and refresh the page
      let response = await Travel.dispatch('getDigest')
      let digest = response.data.d.GetContextWebInformation.FormDigestValue
      let name = this.fileSelected.split('.')[0]
      this.fileName = name
      let payload = {}
      payload.file = this.fileSelected
      payload.name = name
      payload.id = this.TripId
      payload.buffer = this.fileBuffer
      payload.digest = digest
      let item = await Travel.dispatch('uploadTripReport', payload)
      let itemlink = item.data.d.ListItemAllFields.__deferred.uri
      let report = await Travel.dispatch('getReportItem', itemlink)
      payload = report.data.d.__metadata
      payload.file = this.fileSelected
      payload.name = name
      payload.IndexNumber = this.travelmodel.IndexNumber
      Travel.dispatch('updateReportItem', payload).then(function() {
        // Refresh trip with trip report data
        vm.$store.dispatch('support/addActivity', '<div class="bg-success">TripReport-UPDATEREPORTITEM COMPLETED.</div>')
        let event = []
        event.push({
          name: vm.fileName,
          Status: 'WPMReview',
          TripReport: library + vm.fileSelected,
          etag: vm.travelmodel.etag,
          uri: vm.travelmodel.uri
        })
        Travel.dispatch('editTripReport', event).then(function() {
          // Reload tracker
          vm.$store.dispatch('support/addActivity', '<div class="bg-success">TripReport-EDITRIPREPORT COMPLETED.</div>')
          vm.$emit('close')
          let path = '/travel/home/refresh' + vm.mode
          vm.$router.push({ path: path })
        })
      })
    },
    async onFileSelect(args) {
      vm.fileSelected = args.filesData[0].name
      let buffer = vm.getFileBuffer(args.filesData[0].rawFile)
      buffer.then(function(buff) {
        vm.fileBuffer = buff
      })
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
    }
  },
  watch: {
    Show: function() {
      // console.log('SHOW: ' + this.Show)
      if (this.Show == true) {
        let payload = {}
        payload.id = vm.TripId
        Travel.dispatch('getTripById', payload).then(function() {
          vm.$options.interval = setInterval(vm.waitForTrip, 1000)
        })
      } else {
        // TODO: Do we need to clean up here? Or do some other action
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
