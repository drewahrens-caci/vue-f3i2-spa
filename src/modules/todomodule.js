/* eslint-disable */
import TodoService from '@/services/TodoService.js'
import User from '@/models/User'
import Todo from '@/models/Todo'
import moment from 'moment'
import { isNullOrUndefined } from 'util'

const getters = {
  allTodos () {
    return Todo.all()
  },
  Loaded: state => {
    return state.loaded
  },
  MyTodosLoaded: state => {
    return state.mytodosloaded
  },
  mytodos: state => {
    return state.mytodos
  }
}

const actions = {
  getDigest() {
    TodoService.getFormDigest()
      .then(response => {
        Todo.commit((state) => {
          state.digest = response.data.d.GetContextWebInformation.FormDigestValue
        }) 
      })
      .catch(error => {
        console.log('There was an error getting digest data: ', error.response)
      })
  },
  getTodos({ state, commit }) {
    TodoService.getTodos()
      .then(response => {
        // console.log('Todo Data: ' + response)
        Todo.insert({ data: formatAllTodos(response)})
        Todo.commit((state) => {
          state.loaded = true
        }) 
      })
      .catch(error => {
        console.log('There was an error getting todo data: ', error.response)
      })
  },
  getTodoById({ state }, id) {

  },
  getTodosByUser({ state, commit }, userid) {
    // console.log('getTodosByUser: Getting Todos By User Id: ' + userid)
    TodoService.getTodosByUser(userid)
      .then(response => {
        // console.log('Todo Data: ' + response)
        Todo.commit((state) => {
          state.mytodosloaded = true
          state.mytodos = formatTodos(response)
        }) 
      })
      .catch(error => {
        console.log('There was an error getting your todo data: ', error.response)
      })
  },
  completeTodo({ state }, payload) {
    Todo.delete(payload.id) 
    return TodoService.completeTodo(payload.id, payload.uri, payload.etag, state.digest)
    .then(response => {
      return response
    })
    .catch(error => {
      console.log('There was an error completing your todo: ', error.response)
    })
  }
}

/* function fixEtag(etag) {
  let t = etag.length
  if (etag.charAt(0) == '"') etag = etag.substring(1, t--)
  if (etag.charAt(--t) == '"') etag = etag.substring(0, t)
  return etag
} */

function formatTodos(j) {
  let todos = []
  for (let i = 0; i < j.length; i++) {
    let body = ''
    if (!isNullOrUndefined(j[i]['Body'])) { body = String(j[i]['Body']) }
    todos.push({
      id: String(j[i]['Id']),
      user_id: String(j[i]['AssignedToId']['results'][0]),
      Title: j[i]['Title'],
      Body: body.length > 0 ? body : '',
      Status: j[i]['Status'],
      StartDate: moment(j[i]['StartDate']).format('MM/DD/YYYY'),
      DueDate: moment(j[i]['DueDate']).format('MM/DD/YYYY'),
      Priority: j[i]['Priority'],
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return todos
}

function formatAllTodos(j) {
  let todos = []
  for (let i = 0; i < j.length; i++) {
    let body = ''
    if (!isNullOrUndefined(j[i]['Body'])) { body = String(j[i]['Body']) }
    todos.push({
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
      etag: j[i]['__metadata']['etag'],
      uri: j[i]['__metadata']['uri']
    })
  }
  return todos
}

export default{
  getters,
  actions
}