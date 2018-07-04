export const scope = (state) => {
  return state.pageIndex > -1
    ? state.pages[state.pageIndex]
    : state.pageDefault
}
