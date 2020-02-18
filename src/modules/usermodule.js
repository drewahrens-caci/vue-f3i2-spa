/* eslint-disable */
import UserProfileService from '@/services/UserProfileService.js'
import User from '@/models/User'
let id = null

const getters = {
  CurrentUser () {
    return User.all()
  },
  CurrentUserWithTodos () {
    return User.query()
      .with('todos')
      .first()
  },
  CurrentUserId: state => {
    return state.userid
  },
  CurrentUserGroups: state => {
    return state.usergroups
  },
  isOwner: state => {
    return state.isOwner
  },
  isWPManager: state => {
    return state.isWPManager
  },
  isApprover: state => {
    return state.isApprover
  }
}

const actions = {
  getUserId() {
    UserProfileService.getUserId()
      .then(response => {
        User.commit((state) => {
          console.log('USER ID: ' + response.data.d.Id)
          state.userid = response.data.d.Id
        })
      })
      .catch(error => {
        console.log('There was an error getting User Id: ', error.response)
      })
  },
  getUserProfile() {
    UserProfileService.getUserProfile()
      .then(response => {
        console.log('Profile Data: ' + response)
        let profile = {}
        let userid = User.getters('CurrentUserId')
        let properties = response.data.d.UserProfileProperties.results
        profile.id = String(userid)
        // profile.userid = userid
        profile.Account = response.data.d.AccountName
        profile.PictureUrl = response.data.d.PictureUrl
        profile.PersonalUrl = response.data.d.PersonalUrl
        profile.Email = response.data.d.Email
        profile.EmailLink = "mailto:" + response.data.d.Email
        profile.DisplayName = response.data.d.DisplayName
        for (let i = 0; i < properties.length; i++) {
          let property = properties[i]
          // console.log('Key: ' + property.Key)
          switch(property.Key) {
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
          }
        }
        // console.log('Inserting User Data.')
        User.insert({ data: profile })        
      })
      .catch(error => {
        console.log('There was an error getting profile data: ', error.response)
      })
  },
  getUserGroups({ state }) {
    UserProfileService.getUserGroups(state.userid)
      .then(response => {
        console.log('GROUPS: ' + response)
        User.commit((state) => {
          state.usergroups = response.data.d.results
          for (let i = 0; i < state.usergroups.length; i++) {
            switch (state.usergroups[i].Title) {
              case 'Approvers':
                state.isApprover = true
                break
    
              case 'F3I-2 Owners':
                state.isOwner = true
                break
    
              case 'Workplan Managers':
                state.isWPManager = true
                break
            }
          }
        })
      })
      .catch(error => {
        console.log('There was an error getting user groups: ', error.response)
      })
  }
}

export default {
  getters,
  actions
}
