/* eslint-disable */
import TodoService from '@/services/TodoService.js'
import Todo from '@/models/Todo'
import moment from 'moment'

const getters = {
  allTodos () {
    return Todo.all()
  },
  Loaded: state => {
    return state.loaded
  }
}

const actions = {
  getTodos() {
    TodoService.getTodos()
      .then(response => {
        console.log('Todo Data: ' + response)
        Todo.insert({ data: formatTodos(response)})
        Todo.commit((state) => {
          state.loaded = true
        }) 
      })
      .catch(error => {
        console.log('There was an error getting todo data: ', error.response)
      })
  }
}

function formatTodos(j) {
  let todos = []
  for (let i = 0; i < j.length; i++) {
    todos.push({
      id: j[i]['Id'],
      user_id: j[i]['AssignedToId']['results'][0],
      Title: j[i]['Title'],
      Status: j[i]['Status'],
      StartDate: moment(j[i]['StartDate']).format('MM/DD/YYYY'),
      DueDate: moment(j[i]['DueDate']).format('MM/DD/YYYY'),
      Priority: j[i]['Priority']
    })
  }
  // Todo.insert({ data: todos })
  return todos
}

export default{
  getters,
  actions
}