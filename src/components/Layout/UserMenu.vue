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
import Company from '@/models/Company'

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
      Company.dispatch('getCompanies')
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
