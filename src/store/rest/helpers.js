export const scope = (state) => {
  return state.collectionIndex > -1
    ? state.collections[state.collectionIndex]
    : state.collectionDefault
}
