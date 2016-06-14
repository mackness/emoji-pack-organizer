
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import App from './App'
import Emojis from './components/Emojis'
import Stickers from './components/Stickers'
import Gifs from './components/Gifs'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/ra" component={App}>
    	<IndexRoute component={Emojis}/>
    	<Route path="/stickers" component={Stickers} />
    	<Route path="/gifs" component={Gifs} />
    </Route>
  </Router>
), document.getElementById('root'))
