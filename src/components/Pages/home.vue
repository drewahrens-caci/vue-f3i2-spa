<template>
  <b-container fluid>
    <b-row>
      <b-col md="3" xs="12"></b-col>
      <b-col md="6" xs="12"><news></news></b-col>
      <b-col md="3" xs="12"><contracts></contracts></b-col>
    </b-row>
  </b-container>
</template>

<script>
import News from '@/components/News/News.vue'
import Contracts from '@/components/Contracts/Contracts.vue'
export default {
  name: 'home',
  components: {
    News,
    Contracts
  }
}
</script>

<style></style>
