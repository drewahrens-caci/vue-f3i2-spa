<template>
  <b-container fluid class="contentHeight" id="MainContainer">
    <b-row ref="MainRow" class="contentHeight">
      <b-col md="12" xs="12">
        <iframe id="FinancialDashboard" title="Financial Dashboard" ref="frame" :src="iframe.src" class="full-frame"></iframe>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'home',
  data: function() {
    return {
      iframe: {
        src: 'https://infoplus.caci.com/sites/f3i2/Pages/FinancialDashboard.aspx?isDlg=1',
        loaded: false
      }
    }
  },
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      const notification = {
        type: 'info',
        message: 'Loading Financial Dashboard'
      }
      this.$store.dispatch('notification/add', notification, { root: true })
    })
  }
}
</script>
