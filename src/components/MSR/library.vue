<template>
  <b-container fluid class="contentHeight p-0">
    <iframe id="LibraryFrame" src="/sites/f3i2/MSRLibrary/Forms/AllItems.aspx?isDlg=1" height="100%" width="100%"></iframe>
  </b-container>
</template>

<script>
export default {
  mounted: function() {
    this.$options.interval = setInterval(this.hideRibbon, 1500)
  },
  methods: {
    hideRibbon: function() {
      clearInterval(this.$options.interval)
      try {
        let frame = document.getElementsByTagName('iframe')[0].contentWindow
        frame.document.getElementById('s4-ribbonrow').style.display = 'none'
        frame.document.getElementById('s4-workspace').style.padding = '15px'
      } catch (e) {
        // don't care here
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
