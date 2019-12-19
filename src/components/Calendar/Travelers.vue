<template>
  <b-container fluid>

</template>

<script>
import { abstractField } from 'VueFormGenerator'
export default {
  name: 'Travelers',
  data: function() {
    return {
      model: {
        firstName: '',
        lastName: '',
        email: '',
      },
    }
  },
  mixins: [abstractField]
}
</script>
