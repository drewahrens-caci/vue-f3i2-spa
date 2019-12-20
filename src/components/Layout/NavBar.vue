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
                <!-- <a class="dropdown-item dropdown-toggle" href="#">Travel Authorization</a> -->
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
        <ul class="navbar-nav ml-auto hidden-xs">
          <li class="nav-item dropdown dropdown-right">
            <a class="nav-link dropdown-toggle" id="TasksMenu" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon fas icon="tasks" class="icon"></font-awesome-icon>
              <span id="taskmenubadge" class="badge badge-xs badge-warning">5</span>
            </a>
            <ul class="dropdown-menu dropdown-tasks" aria-labelledby="TasksMenu">
              <li>
                <a href="#">
                  <div>
                    <p>
                      <strong>Task 1</strong>
                      <span class="pull-right text-muted">40% Complete</span>
                    </p>
                    <div class="progress progress-striped active">
                      <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">
                        <span class="sr-only">40% Complete (success)</span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li class="divider"></li>
              <li>
                <a href="#">
                  <div>
                    <p>
                      <strong>Task 2</strong>
                      <span class="pull-right text-muted">20% Complete</span>
                    </p>
                    <div class="progress progress-striped active">
                      <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
                        <span class="sr-only">20% Complete</span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li class="divider"></li>
              <li>
                <a href="#">
                  <div>
                    <p>
                      <strong>Task 3</strong>
                      <span class="pull-right text-muted">60% Complete</span>
                    </p>
                    <div class="progress progress-striped active">
                      <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
                        <span class="sr-only">60% Complete (warning)</span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li class="divider"></li>
              <li>
                <a href="#">
                  <div>
                    <p>
                      <strong>Task 4</strong>
                      <span class="pull-right text-muted">80% Complete</span>
                    </p>
                    <div class="progress progress-striped active">
                      <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
                        <span class="sr-only">80% Complete (danger)</span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li class="divider"></li>
              <li>
                <a class="text-center" href="#">
                  <strong>See All Tasks</strong>
                  <i class="fa fa-angle-right"></i>
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown dropdown-right">
            <a class="nav-link dropdown-toggle" id="ProfileMenu" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon far icon="user-circle" class="icon"></font-awesome-icon>
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="ProfileMenu">
              <ul class="dropdown-user">
                <li>
                  <div class="dw-user-box">
                    <div class="u-img">
                      <font-awesome-icon far icon="user-cirlce" class="icon"></font-awesome-icon>
                    </div>
                    <div class="u-text">
                      <h4>YOU</h4>
                      <p class="text-muted">varun@gmail.com</p>
                      <a href="" class="btn btn-rounded btn-danger btn-sm">View Profile</a>
                    </div>
                  </div>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                  <a href="#"><i class="ti-user"></i> My Profile</a>
                </li>
                <li>
                  <a href="#"><i class="ti-wallet"></i> My Balance</a>
                </li>
                <li>
                  <a href="#"><i class="ti-email"></i> Inbox</a>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                  <a href="#"><i class="ti-settings"></i> Account Setting</a>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                  <a href="#"><i class="fa fa-power-off"></i> Logout</a>
                </li>
              </ul>
            </div>
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

<style lang="scss" scoped></style>
