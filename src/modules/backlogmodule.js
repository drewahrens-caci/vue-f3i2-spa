/* eslint-disable */
import BacklogService from '@/services/BacklogService.js'
import Backlog from '@/models/Backlog'
import moment from 'moment'
import { isNullOrUndefined } from 'util'

const getters = {
  allItems () {
    return Backlog.all()
  },
  Loaded: state => {
    return state.loaded
  },
  MyItemsLoaded: state => {
    return state.myitemsloaded
  },
  myitems: state => {
    return state.myitems
  }
}

const actions = {
  getDigest() {
    BacklogService.getFormDigest()
      .then(response => {
        Backlog.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  getItems({ state, commit }) {
    BacklogService.getItems()
      .then(response => {
        Backlog.insert({ data: formatAllItems(response)})
        Backlog.commit((state) => {
          state.loaded = true
        }) 
      })
      .catch(error => {
        console.log('There was an error getting item data: ', error.response)
      })
  },
  getItemsByUser({ state, commit }, userid) {
    // console.log('getItemsByUser: Getting Items By User Id: ' + userid)
    BacklogService.getItemsByUser(userid)
      .then(response => {
        // console.log('Item Data: ' + response)
        Backlog.commit((state) => {
          state.myitemsloaded = true
          state.myitems = formatAllItems(response)
        }) 
      })
      .catch(error => {
        console.log('There was an error getting your item data: ', error.response)
      })
  },
  completeItem({ state }, payload) {
    Backlog.delete(payload.id) 
    return BacklogService.completeItem(payload.id, payload.uri, payload.etag, state.digest)
    .then(response => {
      return response
    })
    .catch(error => {
      console.log('There was an error completing your item: ', error.response)
    })
  }
}

function formatAllItems(j) {
  let items = []
  for (let i = 0; i < j.length; i++) {
    let body = ''
    if (!isNullOrUndefined(j[i]['Body'])) { body = String(j[i]['Body']) }
    items.push({
      id: String(j[i]['Id']),
      Title: j[i]['Title'],
      Body: body.length > 0 ? body : '',
      Status: j[i]['Status'],
      StartDate: moment(j[i]['StartDate']).format('MM/DD/YYYY'),
      DueDate: moment(j[i]['DueDate']).format('MM/DD/YYYY'),
      PercentComplete: j[i]['PercentComplete'],
      Priority: j[i]['Priority'],
      FirstName: j[i]['AssignedTo']['FirstName'],
      LastName: j[i]['AssignedTo']['LastName'],
      EMail: j[i]['AssignedTo']['EMail'],
      IsMilestone: j[i]['IsMilestone'],
      Milestone: isNullOrUndefined(j[i]['Milestone']) ? '' : j[i]['Milestone'],
      Effort: j[i]['Effort'],
      Sprint: j[i]['Sprint'],
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return items
}

export default{
  getters,
  actions
}