
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import App from './App'
import Emojis from './components/Emojis'
import Stickers from './components/Stickers'
import Gifs from './components/Gifs'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/ra/:keyboard_ID/emojis" component={App}>
    	<IndexRoute handler={App} component={Emojis} />
    	<Route path="/ra/:keyboard_ID/stickers" handler={App} component={Stickers} />
    	<Route path="/ra/:keyboard_ID/gifs" handler={App} component={Gifs} />
    </Route>
  </Router>
), document.getElementById('root'))
