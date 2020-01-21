<template>
  <div>
    <nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
      <div class="navbar-header">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="200" height="48" viewBox="0 0 200 48">
              <path d="M0,0 L200.000,0 L185.000,48.000 L-23.000,48.000 L0,0 Z" class="navbar-brand-svg" />
            </svg>
            <a class="navbar-brand" href="/" id="NavbarBrandLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">F3I-2</a>
            <ul class="dropdown-menu" id="BrandDropdown" aria-labelledby="NavbarBrandLink">
              <li class="settingsli"><font-awesome-icon fas icon="chalkboard-teacher" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Instructions</a></li>
              <li class="settingsli"><font-awesome-icon fas icon="plane" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Leave Request</a></li>
              <li class="settingsli"><font-awesome-icon far icon="file-alt" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Forms Library</a></li>
              <li class="settingsli"><font-awesome-icon far icon="comment-dots" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Contact Us</a></li>
            </ul>
          </li>
        </ul>
      </div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown dropdown-left">
            <a class="nav-link menu-hover" href="#" id="TeamsMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="menutext">Teams</span>
            </a>
            <ul class="dropdown-menu" id="ulTeams" aria-labelledby="TeamsMenuLink">
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">TEAM 1</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">TEAM 2</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">TEAM 3</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">TEAM 4</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown dropdown-left">
            <a class="nav-link menu-hover" href="/" id="ProcessesMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="menutext">Processes</span>
            </a>
            <ul class="dropdown-menu" id="ulProcesses" aria-labelledby="ProcessesMenuLink">
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">CDRL Management</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">CDRL Government Review</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <router-link :to="{ name: 'Travel' }" class="dropdown-item dropdown-toggle">Travel Authorization</router-link>
                <ul class="dropdown-menu">
                  <li>
                    <router-link :to="{ name: 'Travel Request' }" class="dropdown-item">New Travel Request</router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'Travel Approval' }" class="dropdown-item">Travel Approval</router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'Update Travel' }" class="dropdown-item">Update Travel</router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown dropdown-left">
            <a class="nav-link menu-hover" href="/" id="ProgramManagementMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="menutext">Program Management</span>
            </a>
            <ul class="dropdown-menu" id="ulProgramManagement" aria-labelledby="ProgramManagementMenuLink">
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">Program Management Office</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">Program Staffing</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">Work Plan Tracker</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">Risk Management</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown dropdown-left">
            <a class="nav-link menu-hover" href="/" id="ToolsMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span class="menutext">Tools</span>
            </a>
            <ul class="dropdown-menu" id="ulTools" aria-labelledby="ToolsMenuLink">
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">TOOL 1</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">TOOL 2</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">TOOL 3</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="#">TOOL 4</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Submenu</a></li>
                  <li><a class="dropdown-item" href="#">Submenu 0</a></li>
                  <li class="dropdown-submenu">
                    <a class="dropdown-item dropdown-toggle" href="#">Submenu 1</a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Subsubmenu1</a></li>
                      <li><a class="dropdown-item" href="#">Subsubmenu2</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <b-navbar-nav class="ml-auto hidden-xs">
          <b-nav-item-dropdown id="TasksMenu" right no-caret menu-class="animated bounceInDown">
            <template slot="button-content">
              <font-awesome-icon fas icon="tasks" class="icon"></font-awesome-icon>
              <span id="taskmenubadge" class="badge badge-xs badge-warning">5</span>
            </template>
            <b-dropdown-item href="#">
              <div>
                <p>
                  <strong>Task 1</strong>
                  <span class="float-right text-muted">25% Complete</span>
                </p>
                <b-progress :value="25" :max="100" variant="danger" show-progress animated></b-progress>
              </div>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <div>
                <p>
                  <strong>Task 2</strong>
                  <span class="float-right text-muted">75% Complete</span>
                </p>
                <b-progress :value="75" :max="100" variant="info" show-progress animated></b-progress>
              </div>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <div>
                <p>
                  <strong>Task 3</strong>
                  <span class="float-right text-muted">60% Complete</span>
                </p>
                <b-progress :value="60" :max="100" variant="warning" show-progress animated></b-progress>
              </div>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <div>
                <p>
                  <strong>Task 4</strong>
                  <span class="float-right text-muted">90% Complete</span>
                </p>
                <b-progress :value="95" :max="100" variant="success" show-progress animated></b-progress>
              </div>
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item>
              <strong>See All Tasks</strong>
              <font-awesome-icon fas icon="angle-right" class="icon"></font-awesome-icon>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <form role="search" class="form-inline my-2 app-search hidden-xs ">
          <input type="text" placeholder="Search..." class="form-control" v-model="searchinput" v-on:keyup.enter="searchme" />
          <a href="#" @click.stop="searchme"><i class="fa fa-search"></i></a>
        </form>
        <ul class="navbar-nav">
          <li id="ulUser" class="nav-item dropdown">
            <a class="nav-link" href="#" id="UserMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <img id="UPImg" :src="profiledata.PictureUrl" alt="Personal Photo" />
            </a>
            <ul class="dropdown-menu dropdown-menu-right animated flipInY" aria-labelledby="UserMenuLink">
              <li class="userli">
                <img id="UPDDImg" :src="profiledata.PictureUrl" alt="Personal Photo" class="float-left" />
                <span id="UserName">{{ profiledata.DisplayName }}</span>
              </li>
              <li class="userli">
                <font-awesome-icon far icon="envelope" class="icon"></font-awesome-icon>
                <a id="UserEmail" :href="profiledata.EmailLink">{{ profiledata.Email }}</a>
              </li>
              <li class="userli">
                <font-awesome-icon fas icon="phone-alt" class="icon"></font-awesome-icon>
                <span>{{ profiledata.Phone }}</span>
              </li>
              <li class="userli">
                <font-awesome-icon fas icon="mobile-alt" class="icon"></font-awesome-icon>
                <span>{{ profiledata.CellPhone }}</span>
              </li>
            </ul>
          </li>
          <li id="ulSettings" class="nav-item dropdown">
            <a class="nav-link" href="#" id="SettingsMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon fas icon="cog" class="icon"></font-awesome-icon>
            </a>
            <ul class="dropdown-menu dropdown-menu-right animated bounceInDown" aria-labelledby="SettingsMenuLink">
              <li id="ulsettings_AddPage" class="settingsli">
                <font-awesome-icon far icon="file-alt" class="icon"></font-awesome-icon>
                <a
                  class="dropdown-item"
                  onclick="javascript:if (LaunchCreateHandler('PublishingPage')) { SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', function() { var dlgOptions = { url:'\u002fsites\u002ff3i2\u002f_layouts\u002f15\u002fCreatePublishingPageDialog.aspx', autoSize: true, autoSizeStartWidth: 550 };  SP.UI.ModalDialog.showModalDialog(dlgOptions); }); };"
                  >Add a page</a
                >
              </li>
              <li id="ulsettings_EditPage" class="settingsli">
                <font-awesome-icon far icon="edit" class="icon"></font-awesome-icon>
                <a
                  class="dropdown-item"
                  onclick="javascript:SP.SOD.executeFunc('sp.ui.pub.ribbon.js', 'Pub.Ribbon.PubCommands', function() {Pub.Ribbon.PubCommands.notifyProgress(SP.Publishing.Resources.notificationMessageLoading);if (document.forms['aspnetForm']['MSOLayout_InDesignMode'] != null) document.forms['aspnetForm']['MSOLayout_InDesignMode'].value = 1;if (document.forms['aspnetForm']['MSOAuthoringConsole_FormContext'] != null) document.forms['aspnetForm']['MSOAuthoringConsole_FormContext'].value = 1;if (document.forms['aspnetForm']['MSOSPWebPartManager_DisplayModeName'] != null) document.forms['aspnetForm']['MSOSPWebPartManager_DisplayModeName'].value = 'Design';__doPostBack('ctl05','edit')});"
                  >Edit page</a
                >
              </li>
              <li id="ulsettings_AddApp" class="settingsli">
                <font-awesome-icon far icon="plus-square" class="icon"></font-awesome-icon>
                <a class="dropdown-item" onclick="GoToPage('\u002fsites\u002ff3i2\u002f_layouts\u002f15\u002faddanapp.aspx')">Add an app</a>
              </li>
              <li id="ulsettings_Manager" class="settingsli">
                <font-awesome-icon fas icon="pencil-alt" class="icon"></font-awesome-icon>
                <a class="dropdown-item" onclick="STSNavigate2(event,'/sites/f3i2/_layouts/15/DesignSite.aspx');">Design Manager</a>
              </li>
              <li id="ulsettings_Contents" class="settingsli">
                <font-awesome-icon fas icon="box-open" class="icon"></font-awesome-icon>
                <a class="dropdown-item" onclick="STSNavigate2(event,'/sites/f3i2/_layouts/15/viewlsts.aspx');">Site contents</a>
              </li>
              <li id="ulsettings_Settings" class="settingsli">
                <font-awesome-icon fas icon="cogs" class="icon"></font-awesome-icon>
                <a class="dropdown-item" onclick="GoToPage('\u002fsites\u002ff3i2\u002f_layouts\u002f15\u002fsettings.aspx')">Site settings</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  computed: {
    profiledata() {
      return this.$store.state.support.profile
    }
  },
  data: function() {
    return {
      searchinput: ''
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      console.log('Getting Navigation')
      this.$store.dispatch('support/getUserProfile')
      // this.$store.dispatch('navbar/getSiteActions')
    })
  },
  methods: {
    searchme: function() {
      /* window.location = 'https://navsea.navy.deps.mil/wc/surinhd/td/private/techrigor/Pages/SearchResults.aspx?k=' + this.searchinput */
      console.log('Woohoo')
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-item:hover {
  cursor: pointer;
}
#UPImg {
  border-radius: 50%;
  height: 25px;
  margin-top: -5px;
}
#UPDDImg {
  border-radius: 50%;
  height: 50px;
}
</style>
