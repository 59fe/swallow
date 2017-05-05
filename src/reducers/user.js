import { handleActions } from 'redux-actions'

const initialState = {
	'userinfo': {
  }
}


export default handleActions({

  'setUserInfo' (state, action) {
    return { ...state, userinfo: action.payload }
  },

  'clearUserInfo' (state, action) {
    return {}
  }

}, initialState)