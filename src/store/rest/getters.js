import { scope } from './helpers'

export const currentData = state => scope(state).currentData
export const newData = state => scope(state).newData
export const data = state => scope(state).data
export const filter = state => scope(state).filter
export const pagination = state => scope(state).pagination
export const searchQuery = state => scope(state).searchQuery
