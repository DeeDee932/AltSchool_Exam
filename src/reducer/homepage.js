const INITIAL_STATE = {
  name: "",
  data: [],
  page: 0,
  rowsPerPage: 10
}

const homepage = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "HANDLE_NAME_CHANGE": {
      return Object.assign({}, state, {name: action.payload})
    }
    case "HANDLE_CACHE_DATA": {
      return Object.assign({}, state, {data: action.payload})
    }
    case "HANDLE_CHANGE_ROWS_PAGE": {
      return Object.assign({}, state, {rowsPerPage: action.payload})
    }
    case "HANDLE_CHANGE_PAGE": {
      return Object.assign({}, state, {page: action.payload.page})
    }
    case "HANDLE_CLEAR_DATA": {
      return Object.assign({}, state, {data: []})
    }
    default:
      return state;
  }
}

export default homepage
