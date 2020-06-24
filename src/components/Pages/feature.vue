<template>
  <b-modal id="FeatureModal" ref="FeatureModal" size="lg" centered @ok="onOk" @close="onClose" @cancel="onCancel">
    <template v-slot:modal-title>Add Bug / Request Feature</template>
    <b-container fluid>
      <b-row class="mb-1">
        <b-col cols="2">Category</b-col>
        <b-col cols="10"><ejs-dropdownlist v-model="newData.Category" :dataSource="categories" :fields="ddfields"></ejs-dropdownlist></b-col>
      </b-row>
      <b-row class="mb-1">
        <b-col cols="2">Title</b-col>
        <b-col cols="10"><input class="e-input" type="text" v-model="newData.Title"/></b-col>
      </b-row>
      <b-row v-if="newData.Category === 'Bug'">
        <b-col cols="2">Description</b-col>
        <b-col cols="10"><b-form-textarea id="textarea" v-model="newData.BugDescription" placeholder="Describe your request or issue..." rows="12" max-rows="16"></b-form-textarea></b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="2">Description</b-col>
        <b-col cols="10"><b-form-textarea id="textarea" v-model="newData.Comment" placeholder="Describe your request or issue..." rows="12" max-rows="16"></b-form-textarea></b-col>
      </b-row>
      <!-- <b-row>
        <b-button-group class="mt-2">
          <b-button variant="danger" ref="btnCancel" class="mr-2" @click="onCancel">Cancel</b-button>
          <b-button variant="success" ref="btnOk" class="ml-2" @click="onSave">Submit</b-button>
        </b-button-group>
      </b-row> -->
    </b-container>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import Feature from '@/models/Feature'
import Bug from '@/models/Bug'
import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'

Vue.use(DropDownListPlugin)

let vm = null

export default {
  name: 'feature',
  computed: {
    loaded() {
      return Feature.getters('Loaded')
    }
  },
  data: function() {
    return {
      ddfields: { text: 'text', value: 'value', index: 'index' },
      newData: {
        Title: '',
        Category: '',
        Comment: '',
        BugDescription: ''
      },
      categories: [
        { text: 'Feature', value: 'Feature' },
        { text: 'User Story', value: 'Story' },
        { text: 'Bug', value: 'Bug' }
      ]
    }
  },
  mounted: function() {
    vm = this
    Feature.dispatch('getDigest')
    Bug.dispatch('getDigest')
    this.$bvModal.show('FeatureModal')
  },
  methods: {
    onOk: function(bvEvent) {
      bvEvent.preventDefault()
      if (this.newData.Category === 'Bug') {
        Bug.dispatch('addBug', this.newData).then(function() {
          vm.$bvModal.hide('FeatureModal')
          vm.$router.back()
        })
      } else {
        Feature.dispatch('addFeature', this.newData).then(function() {
          vm.$bvModal.hide('FeatureModal')
          vm.$router.back()
        })
      }
    },
    onClose: function() {
      this.$router.back()
    },
    onCancel: function() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
input.e-input {
  height: 20px !important;
}

.e-input-group.e-control-wrapper .e-input-group-icon,
.e-input-group .e-input-group-icon {
  min-height: 20px !important;
}
</style>
