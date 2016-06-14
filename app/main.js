import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Types from './components/Types/Types';
import NoMatch from './components/NoMatch/NoMatch';
import { Router, Route, Link, browserHistory } from 'react-router';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/ra" component={App}>
    	<Route path="ra/type/" component={Types}>
    		<Route path="*" component={NoMatch}/>
    	</Route>
    </Route>
  </Router>
), document.getElementById('root'));
