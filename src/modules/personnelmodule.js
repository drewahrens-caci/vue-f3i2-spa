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
  },
  PersonnelWPs: state => {
    return state.personnelwps
  },
  Contacts: state => {
    return state.contacts
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
    console.log('GETTING ALL PERSONNEL.')
    let response = await PersonnelService.getPersonnel()
    Personnel.create({ data: formatPersonnel(response) })
    Personnel.commit(state => {
      state.contacts = formatContacts(response)
      state.loaded = true
    })
  },
  async getPersonnelByEmail({ state }, email) {
    console.log('GETTING PERSONNEL BY EMAIL.')
    let response = await PersonnelService.getPersonnelByEmail(email)
    return response
  },
  async addPerson({ state }, payload) {
    let response = await PersonnelService.savePersonnel(payload, state.digest, 'new')
    return response
  },
  async editPerson({ state }, payload) {
    let response = await PersonnelService.savePersonnel(payload, state.digest, 'edit')
    return response
  }
}

function formatPersonnel(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Contact: j[i]['Contact'] == true ? 'Yes' : 'No',
      WPData: isNullOrUndefined(j[i]['WPData']) ? '' : JSON.parse(j[i]['WPData']),
      Active: j[i]['Active'] == true ? 'Yes' : 'No',
      LastName: j[i]['Title'], // This is the Title column in SharePoint
      FirstName: j[i]['FirstName'],
      Middle: j[i]['Middle'],
      Cadency: j[i]['Cadency'],
      Position: j[i]['Position'],
      Location: j[i]['Location'],
      Email: j[i]['Email'],
      Phone: j[i]['Phone'],
      Company: j[i]['Company'],
      SubET: j[i]['SubET'],
      CACStatus: j[i]['CACStatus'],
      CACRequestDate: moment(j[i]['CACRequestDate']).isValid() ? String(moment(j[i]['CACRequestDate']).format('MM/DD/YYYY')) : '', // date
      CACExpirationDate: moment(j[i]['CACExpirationDate']).isValid() ? String(moment(j[i]['CACExpirationDate']).format('MM/DD/YYYY')) : '', // date
      SCIFormStatus: j[i]['SCIFormStatus'],
      SCIFormType: j[i]['SCIFormType'],
      SCIFormSubmitted: moment(j[i]['SCIFormSubmitted']).isValid() ? String(moment(j[i]['SCIFormSubmitted']).format('MM/DD/YYYY')) : '', // date
      PRDueDate: moment(j[i]['PRDueDate']).isValid() ? String(moment(j[i]['PRDueDate']).format('MM/DD/YYYY')) : '', // date
      CEDate: moment(j[i]['CEDate']).isValid() ? String(moment(j[i]['CEDate']).format('MM/DD/YYYY')) : '', // date
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return p
}

function formatContacts(j) {
  let p = []
  for (let i = 0; i < j.length; i++) {
    let isContact = j[i]['Contact'] == true ? 'Yes' : 'No'
    if (isContact == 'Yes')
    p.push({
      id: j[i]['Id'],
      Id: j[i]['Id'],
      Name: j[i]['FirstName'] + ' ' + j[i]['Title'],
      LastName: j[i]['Title'], // This is the Title column in SharePoint
      FirstName: j[i]['FirstName'],
      Middle: j[i]['Middle'],
      Cadency: j[i]['Cadency'],
      Position: j[i]['Position'],
      Location: j[i]['Location'],
      Email: j[i]['Email'],
      Phone: j[i]['Phone'],
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
