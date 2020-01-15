<template>
  <div class="user">
    <div class="photo">
      <img id="UserImage" :src="profiledata.PictureUrl" alt="Personal Photo" />
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click.stop="toggleMenu" href="#">
        <span class="UserName">
          {{ profiledata.DisplayName }}
          <b class="caret"></b>
        </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <el-collapse-transition>
          <ul class="nav" v-show="!isClosed">
            <slot>
              <li>
                <a class="profile-dropdown" :href="profiledata.PersonalUrl">
                  <span class="sidebar-mini"><font-awesome-icon fas icon="cog" class="icon"></font-awesome-icon></span>
                  <span class="sidebar-normal">My Profile</span>
                </a>
              </li>
            </slot>
          </ul>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
let vm = null
import User from '@/models/User'
import Todo from '@/models/Todo'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

export default {
  components: {
    [CollapseTransition.name]: CollapseTransition
  },
  computed: {
    profiledata() {
      /* return User.all() */
      return User.query().first()
    },
    todosloaded() {
      return Todo.getters('Loaded')
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isClosed: true
      // profiledata: null
    }
  },
  mounted: function() {
    vm = this
    this.$nextTick(function() {
      // this.getUserProfile()
      this.getTodos()
    })
  },
  methods: {
    toggleMenu() {
      this.isClosed = !this.isClosed
    },
    getUserProfile: function() {
      if (this.todosloaded) {
        clearInterval(this.$options.interval)
        console.log('Getting User Profile')
        // this.$store.dispatch('support/getUserProfile')
        // User.dispatch('getUserId').then(function() {
        User.dispatch('getUserProfile').then(function() {
          console.log('User Returned.')
          // Todo.dispatch('getTodos')
        })
        // })
      }
    },
    getTodos: function() {
      User.dispatch('getUserId').then(function() {
        Todo.dispatch('getTodos').then(function() {
          // set interval to wait for todos to be loaded then call the user method.
          // Hopeful that this will have time to ensure todos exist before setting up the user.
          vm.$options.interval = setInterval(vm.getUserProfile, 1000)
        })
      })
    }
  }
}
</script>
<style>
.collapsed {
  transition: opacity 1s;
}
.UserName {
  font-size: 14px;
}
</style>
