import { scope, newScope as NewScope } from './helpers'
import Vue from 'vue'


const loadData = (data, key, state) => {
  if (!isNaN(key)) {
    scope(state).data.push(data)
  } else if (key.startsWith('_')) {
    key = key.substr(1)
    if (scope(state).hasOwnProperty(key)) {
      scope(state)[key] = data
    }
  }
}

export const ADD_DATA = (state, data) => {
  scope(state).data.unshift(data)
  RESET_SCOPE(state)
}

export const CHANGE_SEARCH_QUERY = (state, query) => {
  scope(state).searchQuery = query
  RESET_SCOPE(state)
}

export const LOAD_DATA = (state, { data, pagination }) => {
  scope(state).data = scope(state).data.concat(data)
  scope(state).pagination = pagination
  RESET_SCOPE(state)
}

export const REMOVE_DATA = (state, { id, index }) => {
  if (index === undefined && id) {
    index = scope(state).data.findIndex(row => row.id == id)
  }
  if (index !== undefined) {
    scope(state).data.splice(index,1)
  }
  RESET_SCOPE(state)
}

export const REMOVE_MANY_BY_IDS = (state, ids) => {
  ids.forEach(
    id => {
      scope(state).data
        .splice(
          scope(state).data
            .findIndex(
              row => row.id == id
            ),
          1
        )
    }
  )
  RESET_SCOPE(state)
}

export const RESET_CURRENT_DATA = state => {
  scope(state).currentDataIndex = -1
  Vue.set(scope(state), 'currentData', {})
  RESET_SCOPE(state)
}

export const RESET_DATA = (state) => {
  let newScope = NewScope(state)
  newScope.id = scope(state).id
  newScope.searchQuery = scope(state).searchQuery
  newScope.filter = scope(state).filter
  state.collections.splice(state.collectionIndex, 1, newScope)
  RESET_SCOPE(state)
}

const RESET_SCOPE = state => {
  if (state.previousCollectionIndex > -1) {
    state.collectionIndex = state.previousCollectionIndex
  }
}

export const SCOPE_TO = (state, id) => {
  state.collectionIndex = state.collections.findIndex(collection => collection.id == id)
  if (state.collectionIndex == -1) {
    let collection = NewScope(state)
    collection.id = id
    state.collections.push(collection)
    state.collectionIndex = state.collections.length - 1
  }
}

export const SET_CURRENT_DATA = (state, data) => {
  Vue.set(scope(state), 'currentData', Object.assign({}, data))
  let index = scope(state).data.findIndex(row => row.id == data.id)
  scope(state).currentDataIndex = index
  RESET_SCOPE(state)
}

export const SET_CURRENT_DATA_BY_ID = (state, id) => {
  let data = scope(state).data.find(row => row.id == id)
  SET_CURRENT_DATA(state, data)
}

export const SET_CURRENT_DATA_PAGE = (state, page) => {
  scope(state).pagination.page = page
  RESET_SCOPE(state)
}

export const SET_FILTER = (state, filter) => {
  Vue.set(scope(state), 'filter', filter)
  RESET_SCOPE(state)
}

export const SET_ROWS_NUMBER = (state, number) => {
  scope(state).pagination.rowsNumber = number
  RESET_SCOPE(state)
}

export const TEMP_SCOPE_TO = (state, id) => {
  state.previousCollectionIndex = state.collectionIndex
  SCOPE_TO(state, id)
}

export const UPDATE_ON_CURRENT_DATA = (state, { name, value }) => {
  Vue.set(scope(state).currentData, name, value)
  RESET_SCOPE(state)
}

export const UPDATE_CURRENT_DATA = (state, data) => {
  scope(state).data.splice(scope(state).currentDataIndex, 1, data)
  SET_CURRENT_DATA(state, data)
  RESET_SCOPE(state)
}

export const UPDATE_PAGINATION = (state, pagination) => {
  scope(state).pagination = pagination
}

export const UPDATE_ROWS_PER_PAGE = (state, rows) => {
  scope(state).pagination.rowsPerPage = rows
  RESET_SCOPE(state)
}
