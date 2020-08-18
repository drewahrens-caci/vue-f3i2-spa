import SupportService from '@/services/SupportService.js'

export const namespaced = true

export const state = {
  legendItems: [],
  legendLoaded: false,
  legendLoading: false,
  profile: {},
  loaded: false,
  activity: '',
  contentrect: {}
}

export const mutations = {
  SET_LOADED(state, loaded) {
    state.loaded = loaded
  },
  SET_PROFILE(state, profile) {
    state.profile = profile
  },
  SET_LEGEND(state, legendItems) {
    state.legendItems = legendItems
  },
  SET_CONTENTRECT(state, values) {
    state.contentrect = values
  },
  SET_ACTIVITY(state, activity) {
    if (state.activity == '') {
      state.activity = activity
    } else {
      state.activity += '<br/>' + activity
    }
  }
}

export const actions = {
  getUserProfile({ commit }) {
    SupportService.getUserProfile()
      .then(response => {
        // console.log('Profile Data: ' + response)
        let profile = {}
        let properties = response.data.d.UserProfileProperties.results
        profile.PictureUrl = response.data.d.PictureUrl
        profile.PersonalUrl = response.data.d.PersonalUrl
        profile.Email = response.data.d.Email
        profile.EmailLink = 'mailto:' + response.data.d.Email
        profile.DisplayName = response.data.d.DisplayName
        for (let i = 0; i < properties.length; i++) {
          let property = properties[i]
          // console.log('Key: ' + property.Key)
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
          }
        }
        commit('SET_PROFILE', profile)
      })
      .catch(error => {
        console.log('There was an error getting profile data: ', error.response)
      })
  },
  setLegendItems({ commit }, items) {
    commit('SET_LEGEND', items)
  },
  addActivity({ commit }, activity) {
    commit('SET_ACTIVITY', activity)
  },
  setContentRect({ commit }, values) {
    commit('SET_CONTENTRECT', values)
  }
}

export const getters = {
  getLegendItems(state) {
    return state.legendItems
  },
  getContentRect(state) {
    return state.contentrect
  }
}
