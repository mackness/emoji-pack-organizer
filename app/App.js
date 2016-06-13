import React from 'react';
import styles from './App.css';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire'



var App = React.createClass({

  mixins: [ReactFireMixin],

  getDefaultProps() {
    return {
      test: 'foo'
    }
  },

  redirectToLogin() {
    window.location.replace(window.location.origin);
  },

  monitorUserState(data) {
    if (!data) {
      this.redirectToLogin();
    }
  }, // asynchronously monitor user state

  componentWillMount() {
    console.log(this.state);
    var ref = new Firebase('https://emoji-dev.firebaseio.com/');
    console.log(ref);
    if (ref.getAuth()) {
      ref.onAuth(this.monitorUserState);
    } else {
      this.redirectToLogin();
    }
  },

  render() {
    return (
      <div className={styles.app}>
        bar
      </div>
    );
  }
});

export default App