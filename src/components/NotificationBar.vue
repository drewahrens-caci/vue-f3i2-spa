<template>
  <b-toast :variant="notification.type" solid append-toast auto-hide-delay="8000" visible>
    <template v-slot:toast-title>
      <div class="d-flex flex-grow-1 align-items-baseline">
        <strong class="mr-auto">{{ notification.title }}</strong>
      </div>
    </template>
    <span>{{ notification.message }}</span>
  </b-toast>
</template>

<script>
/* eslint-disable */
import push from "push.js";
import { mapActions } from "vuex";

export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timeout: null
    };
  },
  mounted() {
    this.timeout = setTimeout(() => this.remove(this.notification), 5000);
    if (this.notification.push == true) {
      push.create(this.notification.title, {
        body: this.notification.message,
        icon:
          _spPageContextInfo.webAbsoluteUrl +
          "/SiteAssets/html/static/img/" +
          this.notification.type +
          ".png",
        link: "/#",
        timeout: 10000,
        onClick: function() {
          window.focus();
          this.close();
        }
      });
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  computed: {
    notificationTypeClass() {
      return `-text-${this.notification.type}`;
    }
  },
  methods: mapActions("notification", ["remove"])
};
</script>

<style scoped>
.notification-bar {
  margin: 1em 0 1em;
}
</style>
