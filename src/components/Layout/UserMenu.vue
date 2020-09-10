<template>
  <div class="user">
    <div class="photo">
      <img id="UserImage" :src="userpic" alt="Personal Photo" />
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click.stop="toggleMenu" href="#">
        <span class="UserName">
          {{ userdisplayname }}
          <b class="caret"></b>
        </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <ul class="nav" v-show="!isClosed">
          <slot>
            <li>
              <a class="profile-dropdown" :href="userurl">
                <span class="sidebar-mini"><font-awesome-icon fas icon="cog" class="icon"></font-awesome-icon></span>
                <span class="sidebar-normal">My Profile</span>
              </a>
            </li>
          </slot>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
let vm = null
import User from '@/models/User'
import Personnel from '@/models/Personnel'
import Workplan from '@/models/WorkPlan'

let SPCI = null
if (window._spPageContextInfo) {
  SPCI = window._spPageContextInfo
}

let baseurl = SPCI.webServerRelativeUrl

export default {
  computed: {
    userloaded() {
      return User.getters('Loaded')
    },
    profiledata() {
      return User.query().first()
    },
    UserId() {
      return User.getters('CurrentUserId')
    },
    usergroups() {
      return User.getters('CurrentUserGroups')
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      todocount: 0,
      userdisplayname: '',
      userpic: baseurl + '/SiteAssets/html/static/img/user.png',
      userurl: '#',
      isClosed: true
    }
  },
  errorCaptured(err, vm, info) {
    const notification = {
      type: 'danger',
      title: 'Error in UserMenu ' + err,
      message: info,
      push: true
    }
    this.$store.dispatch('notification/add', notification, { root: true })
  },
  mounted: function() {
    vm = this
    this.$nextTick(function() {
      Workplan.dispatch('getDigest')
      Workplan.dispatch('getWorkplans')
      Personnel.dispatch('getDigest')
      Personnel.dispatch('getPersonnel')
      if (!vm.userloaded) {
        User.dispatch('getUserId').then(function() {
          vm.$options.interval = setInterval(vm.getUserProfile, 1000)
        })
      }
    })
  },
  methods: {
    toggleMenu() {
      this.isClosed = !this.isClosed
    },
    getUserProfile: function() {
      clearInterval(this.$options.interval)
      User.dispatch('getUserProfile').then(function() {
        vm.$options.interval = setInterval(vm.updateUserPic, 1000)
      })
    },
    updateUserPic: function() {
      clearInterval(this.$options.interval)
      try {
        this.userpic = this.profiledata.PictureUrl
        this.userdisplayname = this.profiledata.DisplayName
        this.userurl = this.profiledata.PersonalUrl
      } catch (e) {
        // do not care
      }
      User.dispatch('getUserGroups').then(function() {
        vm.$options.interval = setInterval(vm.waitForGroups, 1000)
      })
    },
    waitForGroups: function() {
      if (this.usergroups && this.usergroups.length > 0) {
        clearInterval(this.$options.interval)
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.$options.interval)
  }
}
</script>
<style lang="css">
/* #Todos table {
  border-collapse: collapse;
}

#Todos table,
#Todos th,
#Todos td {
  border: 1px solid black !important;
}

#Todos th,
#Todos td {
  height: 20px;
}

#Todos td {
  text-indent: 3px;
}

#Todos .smallbutton {
  padding: 0.1rem !important;
  line-height: 1;
  min-width: 1em;
  font-size: 0.5rem !important;
}

#Todos .actionbutton {
  padding: 0.1rem !important;
  line-height: 1;
  min-width: 1em;
  font-size: 1rem !important;
  color: black;
  background-color: transparent;
  border: none;
  margin-left: 2px;
}

#Todos .modal-title {
  margin: 0 auto;
  line-height: 1.5;
  width: 100%;
  text-align: center;
  color: #ffffff !important;
}

#Todos .close {
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
  color: #ffffff !important;
  opacity: 1;
}

#Profile .modal-title {
  margin: 0 auto;
  line-height: 1.5;
  width: 100%;
  text-align: center;
  color: #ffffff !important;
}

#Profile .close {
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
  color: #ffffff !important;
  opacity: 1;
} */

.collapsed {
  transition: opacity 1s;
}
.UserName {
  font-size: 14px;
}
#userbadgeA {
  float: right;
  right: 30px;
  width: 20px;
  margin-top: 1px;
}
#userbadgeB {
  width: 20px;
  float: right;
  right: -10px;
  margin-top: 4px;
}
</style>
