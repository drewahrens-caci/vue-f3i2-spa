<template>
  <b-container fluid class="contentHeight p-0">
    <b-row class="m-1">
      <b-dropdown :text="month ? month : 'Month'" class="filterSelection" v-if="monthValues.length > 0" variant="secondary">
        <b-dropdown-item v-for="monthValue in monthValues" :key="monthValue.value" :value="monthValue.value" @click="month = monthValue.value">{{ monthValue.text }}</b-dropdown-item>
      </b-dropdown>
      <b-dropdown :text="year ? year : 'Year'" class="filterSelection" v-if="yearValues.length > 0" variant="secondary">
        <b-dropdown-item v-for="yearValue in yearValues" :key="yearValue.value" :value="yearValue.value" @click="year = yearValue.value">{{ yearValue.text }}</b-dropdown-item>
      </b-dropdown>
      <b-dropdown :text="workplan ? workplan : 'Workplan'" class="filterSelection" v-if="workplans.length > 0" variant="secondary">
        <b-dropdown-item v-for="workplanValue in workplans" :key="workplanValue" :value="workplanValue.value" @click="workplan = workplanValue.value">{{ workplanValue.value }}</b-dropdown-item>
      </b-dropdown>
      <b-button variant="danger" class="filterSelection" @click="clearFilters()">Clear</b-button>
      <b-button variant="success" class="filterSelection" @click="filterLibrary()">Filter</b-button>
      <b-button variant="light" class="filterSelection" @click="copyFilter()">Copy Filter Link</b-button>
    </b-row>
    <iframe id="LibraryFrame" :src="url" height="100%" width="100%"></iframe>
  </b-container>
</template>

<script>
import Workplan from '@/models/WorkPlan'
/*const date = new Date()
const currentMonth = date.toLocaleString('default', { month: 'short' }).toLocaleUpperCase()
const currentYear = date.toLocaleString('default', { year: 'numeric' })*/
const originalUrl = '/sites/f3i2/MSRLibrary/Forms/AllItems.aspx?isDlg=1'
let vm = null
export default {
  name: 'msr-library',
  props: {
    month: {
      type: String
    },
    year: {
      type: String
    },
    workplan: {
      type: String
    }
  },
  computed: {
    workplans() {
      return Workplan.getters('DropDown')
    }
  },
  data: function() {
    return {
      url: originalUrl,
      filterArray: [],
      // Get these converted over to objects like above
      monthValues: [
        { value: null, text: 'Select ...' },
        { value: 'JAN', text: 'JAN' },
        { value: 'FEB', text: 'FEB' },
        { value: 'MAR', text: 'MAR' },
        { value: 'APR', text: 'APR' },
        { value: 'MAY', text: 'MAY' },
        { value: 'JUN', text: 'JUN' },
        { value: 'JUL', text: 'JUL' },
        { value: 'AUG', text: 'AUG' },
        { value: 'SEP', text: 'SEP' },
        { value: 'OCT', text: 'OCT' },
        { value: 'NOV', text: 'NOV' },
        { value: 'DEC', text: 'DEC' }
      ],
      yearValues: [
        { value: null, text: 'Select ...' },
        { value: '2019', text: '2019' },
        { value: '2020', text: '2020' },
        { value: '2021', text: '2021' },
        { value: '2022', text: '2022' }
      ]
    }
  },
  mounted: function() {
    vm = this
    this.filterLibrary()
  },
  methods: {
    clearFilters: function() {
      console.log(`CLEARING FILTER: ${this.url}`)
      this.month = null
      this.year = null
      this.workplan = null
      this.filterArray.forEach(function(fa) {
        vm.filterArray.pop(fa)
      })
      this.filterLibrary()
    },
    copyFilter: function() {
      let link = window.location.href
      if (this.month) {
        link += '/month/' + this.month
      }
      if (this.year) {
        link += '/year/' + this.year
      }
      if (this.workplan) {
        link += '/workplan/' + this.workplan
      }
      let filterText = document.createElement('textarea')
      filterText.value = link
      filterText.setAttribute('readonly', '')
      filterText.style.position = 'absolute'
      filterText.style.left = '-9999px'
      document.body.appendChild(filterText)
      filterText.select()
      document.execCommand('copy')
      document.body.removeChild(filterText)
    },
    hideRibbon: function() {
      clearInterval(this.$options.interval)
      try {
        let frame = document.getElementsByTagName('iframe')[0].contentWindow
        frame.document.getElementById('s4-ribbonrow').style.display = 'none'
        frame.document.getElementById('s4-workspace').style.padding = '15px'
        frame.document.getElementById('WPQ2_ListTitleViewSelectorMenu_Container').style.display = 'none'
      } catch (e) {
        // don't care here
      }
    },
    filterLibrary: function() {
      this.url = originalUrl
      if (this.clin) {
        if (console) {
          console.log(`CLIN: ${this.clin}`)
        }
        this.filterArray.push({ type: 'CLIN', value: this.clin })
      }
      if (this.month) {
        if (console) {
          console.log(`Month: ${this.month}`)
        }
        this.filterArray.push({ type: 'Month', value: this.month })
      }
      if (this.year) {
        if (console) {
          console.log(`Year: ${this.year}`)
        }
        this.filterArray.push({ type: 'Year', value: this.year })
      }
      if (this.workplan) {
        if (console) {
          console.log(`Workplan: ${this.workplan}`)
        }
        this.filterArray.push({ type: 'WorkplanNumber0', value: this.year })
      }
      if (this.filterArray.length > 0) {
        try {
          this.filterArray.forEach(function(fa, i) {
            var number = i + 1
            vm.url += '&FilterField' + number + '=' + fa.type + '&FilterValue' + number + '=' + fa.value
          })
        } catch (e) {
          console.log(`ERROR: ${e}`)
        }
      }
      this.$options.interval = setInterval(this.hideRibbon, 850)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterSelection {
  margin-left: 0.75rem;
}
</style>
