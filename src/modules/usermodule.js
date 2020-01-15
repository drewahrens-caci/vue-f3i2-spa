/* eslint-disable */
import UserProfileService from '@/services/UserProfileService.js'
import User from '@/models/User'
let id = null

const getters = {
  CurrentUser () {
    return User.all()
  },
  CurrentUserId: state => {
    return state.userid
  }
}

const actions = {
  getUserId() {
    UserProfileService.getUserId()
      .then(response => {
        User.commit((state) => {
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
        // console.log('Profile Data: ' + response)
        let profile = {}
        let userid = User.getters('CurrentUserId')
        let properties = response.data.d.UserProfileProperties.results
        profile.id = userid
        profile.userid = userid
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
          }
        }
        console.log('Inserting User Data.')
        User.insert({ data: profile })        
      })
      .catch(error => {
        console.log('There was an error getting profile data: ', error.response)
      })
  }
}

export default {
  getters,
  actions
}
