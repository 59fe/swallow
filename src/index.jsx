import './base.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import { setUserInfo } from './actions/user'
import { getCurrentUser } from './io'
import { notification } from 'antd'

import List from './containers/List'
import Editor from './containers/Editor'
import createStore from './store'

notification.config({
  top: 80,
  duration: 2
});

const store = createStore()
const history = syncHistoryWithStore(hashHistory, store)

getCurrentUser().then((data) => {
  store.dispatch(setUserInfo(data))
})

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/">
                <IndexRedirect to="list"/>
                <Route path="list" component={List}/>
                <Route path="edit">
                    <IndexRedirect to="new"/>
                    <Route path=":id" component={Editor}/>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
)
