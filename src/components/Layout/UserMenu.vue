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
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

export default {
  components: {
    [CollapseTransition.name]: CollapseTransition
  },
  computed: {
    profiledata() {
      return this.$store.state.support.profile
    }
  },
  props: {
    title: {
      type: String,
      default: 'Tania Andrew'
    }
  },
  data() {
    return {
      isClosed: true
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      console.log('Getting User Profile')
      this.$store.dispatch('support/getUserProfile')
    })
  },
  methods: {
    toggleMenu() {
      this.isClosed = !this.isClosed
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
