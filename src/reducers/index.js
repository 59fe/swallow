
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import editor from './editor'
import list from './list'
import user from './user'

export default combineReducers({
  routing,
  editor,
  list,
  user
})
