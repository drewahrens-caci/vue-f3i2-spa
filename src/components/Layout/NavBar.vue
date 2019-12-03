<template>
  <div>
    <nav class="navbar navbar-expand-md sticky-top navbar-dark bg-dark">
      <div class="navbar-header">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" width="200" height="48" viewBox="0 0 200 48">
              <path d="M0,0 L200.000,0 L175.000,48.000 L-25.000,48.000 L0,0 Z" class="navbar-brand-svg" />
            </svg> -->
            <a class="navbar-brand" href="/" id="navbarTRMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div class="menutext">F3I-2</div></a>
          </li>
        </ul>
      </div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown dropdown-left">
            <a class="nav-link menu-hover" href="/" id="TeamsMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Teams
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
              Processes
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
                <a class="dropdown-item dropdown-toggle" href="#">Travel Authorization</a>
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
            <a class="nav-link menu-hover" href="/" id="ProgramManagementMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Program Management
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
              Tools
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
        <form role="search" class="form-inline my-2 app-search hidden-xs ">
          <input type="text" placeholder="Search..." class="form-control" v-model="searchinput" v-on:keyup.enter="searchme" />
          <a href="#" @click.stop="searchme"><i class="fa fa-search"></i></a>
        </form>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link" href="#" id="SettingsMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon fas icon="cog" class="icon"></font-awesome-icon>
            </a>
            <ul class="dropdown-menu dropdown-menu-right" id="ulSettings" aria-labelledby="SettingsMenuLink">
              <li id="ulsettings_Ribbon" class="hidden settingsli"><font-awesome-icon fas icon="ribbon" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Hide Ribbon</a></li>
              <li id="ulsettings_Shared" class="hidden settingsli"><font-awesome-icon fas icon="share" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Shared with...</a></li>
              <li id="ulsettings_AddPage" class="hidden settingsli"><font-awesome-icon far icon="file-alt" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Add a page</a></li>
              <li id="ulsettings_EditPage" class="hidden settingsli"><font-awesome-icon far icon="edit" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Edit page</a></li>
              <li id="ulsettings_AddApp" class="hidden settingsli"><font-awesome-icon far icon="plus-square" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Add an app</a></li>
              <li id="ulsettings_Manager" class="hidden settingsli"><font-awesome-icon fas icon="pencil-alt" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Design Manager</a></li>
              <li id="ulsettings_Contents" class="hidden settingsli"><font-awesome-icon fas icon="box-open" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Site contents</a></li>
              <li id="ulsettings_Settings" class="hidden settingsli"><font-awesome-icon fas icon="cogs" class="icon"></font-awesome-icon><a class="dropdown-item" href="#">Site settings</a></li>
              <!-- <li id="ManageNavigation" class="hidden settingsli"><font-awesome-icon far icon="compass" class="icon"></font-awesome-icon><a class="dropdown-item" href="/wc/surinhd/td/private/techrigor/Pages/ManageNavigation.aspx">Manage Navigation</a></li> -->
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      searchinput: ''
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      console.log('Getting Navigation')
      // this.$store.dispatch('navbar/getNavigation')
      this.$store.dispatch('navbar/getSiteActions')
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
.navbar {
  padding: 0.5rem 0;
}
.navbar-header {
  width: 200px;
}
.navbar-brand-svg {
  fill: #f4a94c; /* #5aa0f0; */
}
.navbar .navbar-brand {
  color: #000000;
  position: absolute;
  top: 0;
  left: 0;
  padding: 13px 20px;
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  height: 48px;
  width: 225px;
  margin: 0 !important;
  background-color: #f4a94c;
}
.menutext {
  transform: none;
}
.bg-dark {
  background-color: #000000 !important;
}

.dropdown-left {
  min-width: 150px;
}

.menu-hover:hover {
  background-color: #f4a94c;
  /* transform: skew(-25deg); */
}

/* BEGIN SEARCH */
.app-search {
  position: relative;
  margin: 0px;
}
.app-search a {
  position: absolute;
  top: 18px;
  right: 20px;
  color: #ffffff;
}
.app-search .form-control {
  border: none;
  font-size: 13px;
  color: #ffffff;
  padding-left: 20px;
  padding-right: 40px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  height: 50px;
  font-weight: 600;
  width: 180px;
  display: inline-block;
  line-height: 50px;
  transition: 0.5s ease-out;
}
.app-search .form-control:focus {
  border: none;
  font-size: 13px;
  color: #ffffff;
  padding-left: 20px;
  padding-right: 40px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  height: 50px;
  font-weight: 600;
  width: 250px;
  display: inline-block;
  line-height: 50px;
  transition: 0.5s ease-out;
}
.app-search .form-control::-moz-placeholder {
  color: #fafafa;
  opacity: 0.5;
}
.app-search .form-control::-webkit-input-placeholder {
  color: #fafafa;
  opacity: 0.5;
}
.app-search .form-control::-ms-placeholder {
  color: #fafafa;
  opacity: 0.5;
}
/* END SEARCH */
.icon {
  color: white;
  font-size: 18px;
}
.badge {
  display: inline-block;
  min-width: 6px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: 6px;
  margin-top: -7px;
}

.navbar {
  height: 48px;
  font-size: 18px;
  line-height: 18px;
}
.navbar-nav {
  height: 48px;
}
.nav-link {
  display: block;
  height: 48px;
  padding: 15px;
  color: #ffffff;
}
.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 1);
}
.navbar-nav li:hover > ul.dropdown-menu {
  display: block;
}
a:hover > ul.dropdown-menu {
  display: block;
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 10rem;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  color: #ffffff !important;
  text-align: left;
  list-style: none;
  background-color: #000000 !important;
  background-clip: padding-box;
  border: 1px solid #000000;
}

li:hover > .dropdown-item {
  background-color: #f4a94c;
  color: #000000;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #ffffff;
  text-align: inherit;
  white-space: nowrap;
  background-color: #000000;
  border: 0;
}

#ulSettings .dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 0.5rem;
  clear: both;
  font-weight: 400;
  color: #ffffff;
  text-align: inherit;
  white-space: nowrap;
  background-color: #000000;
  border: 0;
}

.settingsli {
  display: inline-flex;
  width: 200px;
}

#ulSettings li:hover {
  background-color: #f4a94c;
}

#ulSettings li:hover > .icon {
  background-color: #f4a94c;
  color: #000000;
}

#ulSettings li:hover > .dropdown-item {
  background-color: #f4a94c;
  color: #000000;
}

#ulSettings .icon {
  color: white;
  font-size: 18px;
  width: 20px;
  margin: 4px;
}

.dropdown-submenu {
  position: relative;
}
.dropdown-submenu > .dropdown-menu {
  top: 0;
  left: 100%;
  margin-top: 0;
}
.dropdown-toggle::after {
  transform: rotate(-90deg);
}
#suiteBar {
  display: none;
}
</style>
