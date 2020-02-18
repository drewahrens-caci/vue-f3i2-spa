/* eslint-disable */
import Personnel from '@/models/Personnel'
import PersonnelService from '@/services/PersonnelService.js'
import { isNullOrUndefined } from 'util'
import moment from 'moment'

const getters = {
  allPersonnel() {
    return Personnel.all()
  },
  dropDown: state => {
    return state.dropdown
  },
  Loaded: state => {
    return state.loaded
  }
}

const actions = {
  getDigest() {
    PersonnelService.getFormDigest()
      .then(response => {
        Personnel.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  async getPersonnel({ state, commit }) {
    let response = await PersonnelService.getPersonnel()
    Personnel.insert({ data: formatPersonnel(response) })
    Personnel.commit(state => {
      state.loaded = true
    })
  },
  async addPerson({ state }, payload) {
    console.log('PAYLOAD: ' + payload)
    let response = await PersonnelService.savePersonnel(payload, state.digest, 'new')
    return response
  },
  async editPerson({ state }, payload) {
    console.log('PAYLOAD: ' + payload)
    let response = await PersonnelService.savePersonnel(payload, state.digest, 'edit')
    return response
  }
}

function formatPersonnel(j) {
  console.log(j.length + ', ' + j[0]['Title'])
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Active: j[i]['Active'],
      LastName: j[i]['Title'], // This is the Title column in SharePoint
      FirstName: j[i]['FirstName'],
      Middle: j[i]['Middle'],
      Cadency: j[i]['Cadency'],
      Position: j[i]['Position'],
      Location: j[i]['Location'],
      Email: j[i]['Email'],
      Contact: j[i]['Contact'],
      Active: j[i]['Active'],
      Company: j[i]['Company'],
      CACRequestDate: moment(j[i]['CACRequestDate']).isValid() ? String(moment(j[i]['CACRequestDate']).format('MM/DD/YYYY')) : '', // date
      CACRequestSubmitted: j[i]['CACRequestSubmitted'], // boolean
      CACExpirationDate: moment(j[i]['CACExpirationDate']).isValid() ? String(moment(j[i]['CACExpirationDate']).format('MM/DD/YYYY')) : '', // date
      EffectiveDate: moment(j[i]['EffectiveDate']).isValid() ? String(moment(j[i]['EffectiveDate']).format('MM/DD/YYYY')) : '', // date
      NominationForm: j[i]['NominationForm'],
      TransferForm: j[i]['TransferForm'],
      FormsSubmitted: moment(j[i]['FormsSubmitted']).isValid() ? String(moment(j[i]['FormsSubmitted']).format('MM/DD/YYYY')) : '', // date
      RequiredAccounts: j[i]['RequiredAccounts'],
      Notes: j[i]['Notes'],
      SubmittedToAFRL: moment(j[i]['SubmittedToAFRL']).isValid() ? String(moment(j[i]['SubmittedToAFRL']).format('MM/DD/YYYY')) : '', // date
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
