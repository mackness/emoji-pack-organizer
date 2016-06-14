
import React from 'react'
import styles from './style.css'
import Firebase from 'firebase'
import ReactFireMixin from 'reactfire'

//components
import NavLink from './components/NavLink'

export default React.createClass({

  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      data: {}
    }
  },

  redirectToLogin() {
    window.location.replace(window.location.origin);
  },

  monitorUserState(data) {
    if (!data) {
      this.redirectToLogin();
    }
  },

  componentWillMount() {
    var rootRef = new Firebase('https://emoji-dev.firebaseio.com/');
    if (rootRef.getAuth()) {
      rootRef.onAuth(this.monitorUserState);
    } else {
      this.redirectToLogin();
    }
  },

  render() {
    return (
      <div>
        <ul role="nav">
          <li><NavLink to="/" onlyActiveOnIndex={true}>Emojis</NavLink></li>
          <li><NavLink to="/stickers">Stickers</NavLink></li>
          <li><NavLink to="/gifs">Gifs</NavLink></li>
        </ul>
        
        {this.props.children}
      </div>
    );
  }

});













