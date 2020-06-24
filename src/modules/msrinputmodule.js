/* eslint-disable */
import Vue from 'vue'
import MSR from '@/models/MSR'
import MSRInputService from '@/services/MSRInputService.js'
import moment from 'moment'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.use(VueLodash, { lodash: lodash })

const getters = {
  Loaded: state => {
    return state.loaded
  }
}

const actions = {
  getDigest() {
    MSRInputService.getFormDigest()
      .then(response => {
        MSR.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  async getMSRInputs({ state, commit }) {
    // This call will eventually pull several items based on the user. This call will only return items for the current user.
    let response = await MSRInputService.getMSRInputs()
    MSRInput.create({ data: formatMSRInput(response) })
    MSRInput.commit(state => {
      state.loaded = true
    })
  },
  async addMSRInput({ state }, payload) {
    // TODO: Do we need to format anything here?
    let response = await MSRInputService.AddMSRInput(payload, state.digest)
    return response
  },
  async editMSRInput({ state }, payload) {
    let response = await MSRInputService.EditMSRInput(payload, state.digest)
    return response
  }
}

function formatMSRInput(j) {
  // console.log('FORMATTING MSRInputS: ' + j)
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Title: j[i]['Title'], // This is the Title column in SharePoint
      Number: j[i]['Number'],
      Revision: j[i]['Revision'],
      POPStart: moment(j[i]['POPStart']).isValid() ? moment(j[i]['POPStart']).format('MM/DD/YYYY') : '',
      POPEnd: moment(j[i]['POPEnd']).isValid() ? moment(j[i]['POPEnd']).format('MM/DD/YYYY') : '',
      DateApproved: moment(j[i]['DateApproved']).isValid() ? moment(j[i]['DateApproved']).format('MM/DD/YYYY') : '',
      Manager: j[i]['Manager']['Title'],
      ManagerId: j[i]['Manager']['ID'],
      ManagerEmail: j[i]['Manager']['EMail'],
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return p
}

export default {
  getters,
  actions
}
