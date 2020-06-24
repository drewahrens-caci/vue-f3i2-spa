<template>
  <div>
    <ejs-richtexteditor ref="rte1" :imageUploadSuccess="onImageUploadSuccess" :insertImageSettings="insertImageSettings"></ejs-richtexteditor>
  </div>
</template>

<script>
import Vue from 'vue'
import { RichTextEditorPlugin, Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table } from '@syncfusion/ej2-vue-richtexteditor'

Vue.use(RichTextEditorPlugin)

export default {
  data: function() {
    return {
      insertImageSettings: {
        saveFormat: 'Base64'
      }
    }
  },
  methods: {
    onImageUploadSuccess: function(args) {
      if (args.e.currentTarget.getResponseHeader('name') != null) {
        console.log('FILENAME: ' + args.e.currentTarget.getResponseHeader('name'))
      }
    }
  },
  provide: {
    richtexteditor: [Toolbar, Link, Image, Count, HtmlEditor, QuickToolbar, Table]
  }
}
</script>

<style lang="sass" scoped></style>
