<template>
  <div class="user">
    <b-modal id="Todos" ref="Todos" scrollable size="xl" centered hide-footer :header-bg-variant="headerBgVariant">
      <template v-slot:modal-title>My Tasks</template>
      <b-form>
        <b-table id="TodosTable" :ref="TodosTable" v-model="shownData" responsive :striped="striped" :bordered="bordered" :small="small" :hover="hover" :items="mytodos" :fields="fields" :primary-key="ID" style="table-layout: fixed;">
          <template v-slot:cell(actions)="data">
            <!-- <b-button size="sm" variant="outline" v-bind:id="getID('DELETE_', shownData[data.index].guid)" class="actionbutton" :class="getClass(shownData[data.index].guid, shownData[data.index].delete)" @click="deleteme(shownData[data.index].guid, shownData[data.index].delete)"> -->
            <b-button size="sm" class="actionbutton" @click="completeme(data.index)" title="Mark Complete">
              <font-awesome-icon far icon="check-circle" class="icon" :style="{ color: 'green' }"></font-awesome-icon>
            </b-button>
            <b-button size="sm" class="actionbutton" @click="data.toggleDetails">
              <font-awesome-icon v-if="data.detailsShowing" far class="icon" icon="minus-square" :style="{ color: 'black' }"></font-awesome-icon>
              <font-awesome-icon v-else-if="shownData[data.index].Body !== ''" far class="icon" icon="plus-square" :style="{ color: 'green' }"></font-awesome-icon>
              <font-awesome-icon v-else far class="icon" icon="plus-square" :style="{ color: 'black' }"></font-awesome-icon>
            </b-button>
          </template>
          <!-- <template v-slot:cell(Status)="data">
            <b-form-select class="form-control-xs bg-light" v-model="shownData[data.index].Status" :options="status"></b-form-select>
          </template> -->
          <template v-slot:row-details="data">
            <b-input-group size="sm" prepend="Description">
              <b-form-input v-model="shownData[data.index].Body"></b-form-input>
            </b-input-group>
          </template>
        </b-table>
      </b-form>
    </b-modal>
    <div class="photo">
      <img id="UserImage" :src="profiledata.PictureUrl" alt="Personal Photo" />
    </div>
    <div class="info">
      <a data-toggle="collapse" :aria-expanded="!isClosed" @click.stop="toggleMenu" href="#">
        <span class="UserName">
          {{ profiledata.DisplayName }}
          <span id="userbadgeA" class="badge badge-xs badge-warning">{{ mytodos.length }}</span>
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
              <li>
                <a class="profile-dropdown" href="#" @click="OpenTodos">
                  <span class="sidebar-mini"><font-awesome-icon fas icon="tasks" class="icon"></font-awesome-icon></span>
                  <span class="sidebar-normal">
                    My Tasks <span id="userbadgeB" class="badge badge-xs badge-warning">{{ mytodos.length }}</span>
                  </span>
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
import { isNullOrUndefined } from 'util'
import push from 'push.js'
import User from '@/models/User'
import Todo from '@/models/Todo'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

export default {
  components: {
    [CollapseTransition.name]: CollapseTransition
  },
  computed: {
    profiledata() {
      return User.query().first()
    },
    UserId() {
      return User.getters('CurrentUserId')
    },
    mytodosloaded() {
      return Todo.getters('MyTodosLoaded')
    },
    mytodos() {
      return Todo.getters('mytodos')
    },
    todos() {
      return Todo.getters('allTodos')
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
      isClosed: true,
      variants: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark', 'black'],
      headerBgVariant: 'black',
      striped: true,
      bordered: true,
      outlined: true,
      small: true,
      hover: true,
      dark: false,
      fixed: false,
      footClone: false,
      fields: [
        { key: 'actions', label: 'Action', thClass: 'text-center px40 text-black' },
        { key: 'Title', label: 'Title', thClass: 'text-center px200 text-black' },
        { key: 'PercentComplete', label: '%Comp', thClass: 'text-center px200 text-black' },
        { key: 'Status', label: 'Status', thClass: 'text-center px80 text-black' },
        { key: 'StartDate', label: 'Start', thClass: 'text-center px80 text-black' },
        { key: 'DueDate', label: 'Due', thClass: 'text-center px80 text-black' },
        { key: 'Priority', label: 'Priority', thClass: 'text-center px80 text-black' }
      ],
      status: [
        { value: 'Not Started', text: 'Not Started' },
        { value: 'In Progress', text: 'In Progress' },
        { value: 'Completed', text: 'Completed' }
      ],
      shownData: []
    }
  },
  mounted: function() {
    vm = this
    this.$nextTick(function() {
      Todo.dispatch('getDigest')
      vm.getUserId()
      console.log('All todos length: ' + vm.todos.length)
    })
  },
  methods: {
    toggleMenu() {
      this.isClosed = !this.isClosed
    },
    OpenTodos: function() {
      this.$bvModal.show('Todos')
    },
    getUserProfile: function() {
      if (this.mytodosloaded) {
        clearInterval(this.$options.interval)
        User.dispatch('getUserProfile').then(function() {
          if (vm.mytodos.length > 0) {
            vm.todocount = vm.mytodos.length
            // TODO: Create cookie to store that the user has been notified from here that they have tasks due. Cookie should expire at the end of the day.
            // TODO: Create interval checking to check for new assigned tasks every few minutes.
            /* push.create('You have some tasks!', {
              body: "Let's get some tasks done!",
              icon: 'https://infoplus.caci.com/sites/f3i2/SiteAssets/html/static/img/task-done-outline.png',
              link: '/#',
              timeout: 10000,
              onClick: function() {
                window.focus()
                this.close()
              }
            }) */
          }
        })
      }
    },
    getUserId: function() {
      User.dispatch('getUserId').then(function() {
        vm.$options.interval = setInterval(vm.getTodosByCurrentUser, 1000)
      })
    },
    getTodosByCurrentUser: function() {
      if (!isNullOrUndefined(this.UserId) && this.UserId > 0) {
        let userid = this.UserId
        // console.log('USERID: ' + userid)
        clearInterval(this.$options.interval)
        this.$store.dispatch('database/todos/getTodosByUser', userid).then(function() {
          // console.log('Dispatched action getTodosByUser')
          vm.$options.interval = setInterval(vm.getUserProfile, 1000)
        })
      }
    },
    refreshMyTodos: function() {
      let userid = this.UserId
      this.$store.dispatch('database/todos/getTodosByUser', userid)
    },
    completeme: function(idx) {
      let payload = {}
      payload.id = this.shownData[idx].id
      payload.uri = this.shownData[idx].uri
      payload.etag = this.shownData[idx].etag
      // console.log('Updating Todo: uri - ' + uri + ', etag - ' + etag)
      this.$store.dispatch('database/todos/completeTodo', payload).then(function(response) {
        let userid = vm.UserId
        vm.$store.dispatch('database/todos/getTodosByUser', userid).then(function() {
          vm.$options.interval = setInterval(vm.refreshMyTodos, 10000)
        })
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.$options.interval)
  }
}
</script>
<style lang="css">
#Todos table {
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
