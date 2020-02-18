<template>
  <div class="p-0" id="Contacts">
    <b-row class="ml-0 mr-0">
      <b-navbar toggleable="md" type="dark" variant="dark" class="fullnavbar">
        <h3 class="contactsbar">Contacts</h3>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form>
              <b-dropdown no-caret right>
                <template slot="button-content" class="annbtn">
                  <font-awesome-icon fas icon="cog" class="icon"></font-awesome-icon>
                </template>
                <b-dropdown-item href="#" @click="addYourself">Add Yourself</b-dropdown-item>
                <b-dropdown-item href="#" @click="addContact">Add Other</b-dropdown-item>
              </b-dropdown>
            </b-nav-form>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </b-row>
  </div>
</template>

<script>
// import ContactsService from '@/services/ContactsService.js'
export default {
  name: 'Contacts',
  data: function() {
    return {
      loaded: false,
      contracts: [],
      max: 100
    }
  },
  mounted: function() {
    // this.$options.interval = setInterval(this.getContacts, 1000)
  },
  methods: {
    getContacts: function() {
      console.log('Getting Contacts...')
      var vm = this
      clearInterval(this.$options.interval)
      ContactsService.getContacts()
        .then(response => {
          console.log('Contacts RETURNED ' + response.length)
          let isdev = false
          let location = String(window.location)
          if (location.indexOf('localhost') > 0) {
            isdev = true
          }
          if (isdev) {
            if (response.data.length > 0) {
              vm.loaded = true
              vm.drawContacts(response.data)
            }
          } else {
            if (response.length > 0) {
              vm.loaded = true
              vm.drawContacts(response)
            }
          }
        })
        .catch(error => {
          console.log('There was an error getting Contacts: ', error)
        })
    },
    getVariant: function(v) {
      let variant = 'danger'
      switch (true) {
        case v == 100:
          variant = 'success'
          break

        case v >= 50 && v <= 99:
          variant = 'warning'
          break
      }
      return variant
    },
    drawContacts: function(j) {
      console.log('DRAWING News')
      let isdev = false
      let location = String(window.location)
      if (location.indexOf('localhost') > 0) {
        isdev = true
      }
      if (isdev) {
        for (let i = 0; i < j.length; i++) {
          this.contracts.push({
            id: j[i]['id'],
            Company: j[i]['Company'],
            manager: j[i]['manager'],
            ponumber: j[i]['ponumber'],
            status: j[i]['status']
          })
        }
        /* this.news = j */
      } else {
        for (let i = 0; i < j.length; i++) {
          this.contracts.push({
            id: j[i]['id'],
            title: j[i]['Title'],
            project: j[i]['Project'],
            activity: j[i]['Activity'],
            poc: j[i]['Poc'],
            location: j[i]['Location'],
            impact: j[i]['Impact']
            // image: j[i]['SliderImage']['Url']
          })
        }
      }
      this.loaded = false // reset for page reloads
    },
    beforeDestroy() {
      clearInterval(this.$options.interval)
    }
  }
}
</script>

<style lang="scss" scoped>
.fullnavbar {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3) !important;
}
#Contacts {
  margin: 10px 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3) !important;
}
#Contacts .contactsbar {
  line-height: normal;
  color: #ffffff;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
