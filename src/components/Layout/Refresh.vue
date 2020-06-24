<template>
  <div>
    <!-- EMPTY -->
  </div>
</template>

<script>
export default {
  name: 'Refresh',
  props: {
    action: String
  },
  mounted: function() {
    console.log('REFRESH ACTION: ' + this.action)
    switch (this.action) {
      case 'travel':
        this.$router.push({ name: 'Travel Calendar', params: { mode: 'default' } })
        break

      case 'personnel':
        this.$router.push({ name: 'Reports', params: { mode: 'default' } })
        break

      case 'features':
        this.$router.push({ name: 'Features' })
        break

      case 'bugs':
        this.$router.push({ name: 'Bugs' })
        break
    }
  }
}
</script>
