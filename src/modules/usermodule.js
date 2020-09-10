import store from '../store/store'
import UserProfileService from '@/services/UserProfileService.js'
import User from '@/models/User'
import Personnel from '@/models/Personnel'

const getters = {
  Loaded: state => {
    return state.loaded
  },
  CurrentUser() {
    return User.all()
  },
  CurrentUserId: state => {
    return state.userid
  },
  CurrentUserGroups: state => {
    return state.usergroups
  },
  AppVersion: state => {
    return state.appversion
  },
  isPM: state => {
    return state.isPM
  },
  isDeveloper: state => {
    return state.isDeveloper
  },
  isOwner: state => {
    return state.isOwner
  },
  isWPManager: state => {
    return state.isWPManager
  },
  isApprover: state => {
    return state.isApprover
  },
  isSecurity: state => {
    return state.isSecurity
  },
  isTravelApprover: state => {
    return state.isTravelApprover
  },
  isPCA: state => {
    return state.isPCA
  },
  isMember: state => {
    return state.isMember
  },
  isAdmin: state => {
    return state.isAdmin
  },
  isSubcontractor: state => {
    return state.isSubcontractor
  }
}

const actions = {
  getUserId() {
    UserProfileService.getUserId()
      .then(response => {
        User.commit(state => {
          // if (console) { console.log('USER ID: ' + response.data.d.Id) }
          state.userid = response.data.d.Id
        })
      })
      .catch(error => {
        console.log('There was an error getting User Id: ', error.response)
      })
  },
  async getPickerUserId(usr) {
    let response = await UserProfileService.getPickerUserId(usr)
    return response
  },
  getUserProfile() {
    UserProfileService.getUserProfile()
      .then(response => {
        let profile = {}
        let userid = User.getters('CurrentUserId')
        let properties = response.data.d.UserProfileProperties.results
        profile.id = String(userid)
        profile.Account = response.data.d.AccountName
        profile.PictureUrl = response.data.d.PictureUrl
        profile.PersonalUrl = response.data.d.PersonalUrl
        profile.Email = response.data.d.Email
        profile.EmailLink = 'mailto:' + response.data.d.Email
        profile.DisplayName = response.data.d.DisplayName
        for (let i = 0; i < properties.length; i++) {
          let property = properties[i]
          switch (property.Key) {
            case 'WorkPhone':
              profile.Phone = property.Value
              break

            case 'CellPhone':
              profile.CellPhone = property.Value
              break

            case 'Manager':
              profile.Manager = property.Value
              break

            case 'AboutMe':
              profile.About = property.Value
              break

            case 'LastName':
              profile.LastName = property.Value
              break

            case 'FirstName':
              profile.FirstName = property.Value
              break
          }
        }
        // to get the Company and Workplan Data we need to get this from the Personnel list based on the current user
        if (profile.Email && profile.Email.length > 2) {
          Personnel.dispatch('getPersonnelByEmail', profile.Email).then(function(response) {
            profile.Company = response[0].Company
            profile.WPData = JSON.parse(response[0].WPData)
            User.insert({ data: profile })
          })
        } else {
          User.insert({ data: profile })
        }
      })
      .catch(error => {
        // console.log('There was an error getting profile data: ', error.response)
        const notification = {
          type: 'danger',
          title: 'Error in usermodule.js getUserProfile function',
          message: error,
          push: true
        }
        store.dispatch('notification/add', notification, { root: true })
      })
  },
  getUserGroups({ state }) {
    UserProfileService.getUserGroups(state.userid)
      .then(response => {
        User.commit(state => {
          state.usergroups = response.data.d.results
          for (let i = 0; i < state.usergroups.length; i++) {
            // if (console) { console.log('GROUP: ' + state.usergroups[i].Title) }
            switch (state.usergroups[i].Title) {
              case 'Developers':
                state.isDeveloper = true
                break

              case 'Approvers':
                state.isApprover = true
                break

              case 'SecurityOfficers':
                state.isSecurity = true
                break

              case 'Travel Approvers':
                state.isTravelApprover = true
                break

              case 'F3I-2 Owners':
                state.isOwner = true
                break

              case 'F3I-2 PCAs':
                state.isPCA = true
                break

              case 'F3I-2 Admins':
                state.isAdmin = true
                break

              case 'MSR Inputters':
                state.isSubcontractor = true
                break

              case 'F3I-2 Members':
                state.isMember = true
                break

              case 'Workplan Managers':
                state.isWPManager = true
                break

              case 'Program Managers':
                state.isPM = true
                break
            }
          }
          state.loaded = true
        })
        state.loaded = true
      })
      .catch(error => {
        if (console) {
          console.log('There was an error getting user groups: ', error.response)
        }
        const notification = {
          type: 'danger',
          title: 'Error in usermodule.js getUserGroups function',
          message: error,
          push: true
        }
        store.dispatch('notification/add', notification, { root: true })
      })
  }
}

export default {
  getters,
  actions
}
