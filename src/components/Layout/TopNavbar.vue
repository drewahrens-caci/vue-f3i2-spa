<template>
  <nav class="navbar navbar-expand-lg ">
    <div class="container-fluid">
      <div class="navbar-minimize">
        <button class="btn btn-outline btn-fill btn-round btn-icon d-none d-lg-block btn-burger" @click.prevent="minimizeSidebar">
          <font-awesome-icon fas :icon="$sidebar.isMinimized ? 'ellipsis-v' : 'bars'" class="icon"></font-awesome-icon>
        </button>
      </div>
      <a class="navbar-brand">{{ this.$route.name }}</a>
      <span id="PageTitle"></span>
      <button type="button" class="navbar-toggler navbar-toggler-right btn-burger" :class="{ toggled: $sidebar.showSidebar }" aria-expanded="false" @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <b-navbar-nav class="ml-auto hidden-xs">
          <b-nav-item-dropdown id="ContactsMenu" right no-caret menu-class="animated bounceInDown">
            <template slot="button-content"> <font-awesome-icon fas icon="users" class="cog"></font-awesome-icon>Contacts </template>
            <!-- <b-dropdown-item v-for="contact in formattedContacts" :key="contact" :href="contact.email"> -->
            <b-table-simple id="ContactsTable" v-for="contact in formattedContacts" :key="contact">
              <b-tbody>
                <b-tr>
                  <b-td rowspan="3" class="px40 p-0 pl-1">
                    <a :href="contact.email" rel="noopener noreferrer"><font-awesome-icon far icon="envelope" class="icon"></font-awesome-icon></a>
                  </b-td>
                  <b-td class="p-0">{{ contact.name }}</b-td>
                </b-tr>
                <b-tr>
                  <b-td class="p-0">{{ contact.position }}</b-td>
                </b-tr>
                <b-tr v-if="contact.phone !== 'Empty'">
                  <b-td class="p-0">{{ contact.phone }}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <!-- </b-dropdown-item> -->
          </b-nav-item-dropdown>
          <b-nav-item-dropdown id="SettingsMenu" right no-caret menu-class="animated bounceInDown">
            <template slot="button-content">
              <font-awesome-icon fas icon="cog" class="cog"></font-awesome-icon>
            </template>
            <b-dropdown-item
              href="#"
              onclick="javascript:if (LaunchCreateHandler('PublishingPage')) { SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', function() { var dlgOptions = { url:'\u002fsites\u002ff3i2\u002f_layouts\u002f15\u002fCreatePublishingPageDialog.aspx', autoSize: true, autoSizeStartWidth: 550 };  SP.UI.ModalDialog.showModalDialog(dlgOptions); }); };"
            >
              <div class="row">
                <font-awesome-icon far icon="file-alt" class="icon"></font-awesome-icon>
                <span>Add a page</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item
              href="#"
              onclick="javascript:SP.SOD.executeFunc('sp.ui.pub.ribbon.js', 'Pub.Ribbon.PubCommands', function() {Pub.Ribbon.PubCommands.notifyProgress(SP.Publishing.Resources.notificationMessageLoading);if (document.forms['aspnetForm']['MSOLayout_InDesignMode'] != null) document.forms['aspnetForm']['MSOLayout_InDesignMode'].value = 1;if (document.forms['aspnetForm']['MSOAuthoringConsole_FormContext'] != null) document.forms['aspnetForm']['MSOAuthoringConsole_FormContext'].value = 1;if (document.forms['aspnetForm']['MSOSPWebPartManager_DisplayModeName'] != null) document.forms['aspnetForm']['MSOSPWebPartManager_DisplayModeName'].value = 'Design';__doPostBack('ctl05','edit')});"
            >
              <div class="row">
                <font-awesome-icon far icon="edit" class="icon"></font-awesome-icon>
                <span>Edit page</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item href="#" onclick="GoToPage('\u002fsites\u002ff3i2\u002f_layouts\u002f15\u002faddanapp.aspx');">
              <div class="row">
                <font-awesome-icon far icon="plus-square" class="icon"></font-awesome-icon>
                <span>Add an app</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item href="#" onclick="STSNavigate2(event,'/sites/f3i2/_layouts/15/DesignSite.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="pencil-alt" class="icon"></font-awesome-icon>
                <span>Design Manager</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item href="#" onclick="STSNavigate2(event,'/sites/f3i2/_layouts/15/viewlsts.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="box-open" class="icon"></font-awesome-icon>
                <span>Site contents</span>
              </div>
            </b-dropdown-item>
            <b-dropdown-item href="#" onclick="GoToPage('\u002fsites\u002ff3i2\u002f_layouts\u002f15\u002fsettings.aspx');">
              <div class="row">
                <font-awesome-icon fas icon="cogs" class="icon"></font-awesome-icon>
                <span>Site settings</span>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </div>
    </div>
  </nav>
</template>
<script>
import Personnel from '@/models/Personnel'
import { isNullOrUndefined } from 'util'

let vm = null

export default {
  computed: {
    routeName() {
      const { name } = this.$route
      return this.capitalizeFirstLetter(name)
    },
    contacts() {
      return Personnel.getters('Contacts')
    }
  },
  data() {
    return {
      activeNotifications: false,
      searchinput: '',
      formattedContacts: []
    }
  },
  mounted: function() {
    vm = this
    vm.$options.interval = setInterval(vm.waitForContacts, 1000)
  },
  methods: {
    waitForContacts: function() {
      if (this.contacts && this.contacts.length > 0) {
        clearInterval(this.$options.interval)
        vm.formatContacts(this.contacts)
      }
    },
    formatContacts: function(contacts) {
      let c = []
      for (let i = 0; i < contacts.length; i++) {
        c.push({
          name: this.camelize(contacts[i].FirstName) + ' ' + this.camelize(contacts[i].LastName),
          position: contacts[i].Position,
          email: 'mailto:' + contacts[i].Email,
          phone: !isNullOrUndefined(contacts[i].Phone) ? contacts[i].Phone : 'Empty'
        })
      }
      this.formattedContacts = c
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    camelize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications
    },
    closeDropDown() {
      this.activeNotifications = false
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false)
    },
    minimizeSidebar() {
      this.$sidebar.toggleMinimize()
    }
  }
}
</script>
<style>
#PageTitle {
  font-weight: 400;
  margin: 5px 0;
  font-size: 18px;
  color: #fff !important;
}
</style>
