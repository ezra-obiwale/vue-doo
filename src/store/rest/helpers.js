export const scope = (state) => {
  return state.collectionIndex > -1
    ? state.collections[state.collectionIndex]
    : Object.assign({}, state.collectionDefault)
}

export const newScope = (state) => {
  return JSON.parse(JSON.stringify(state.collectionDefault))
}
