import React from 'react';
import styles from './App.css';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import $ from 'jquery';

var App = React.createClass({

  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      test: 'foo'
    }
  },

  makeArray(obj) {
    return $.map(obj, (item, index)=> {
      return item
    });
  },

  redirectToLogin() {
    window.location.replace(window.location.origin);
  },

  monitorUserState(data) {
    if (!data) {
      this.redirectToLogin();
    }
  }, // asynchronously monitor user state

  monitorRootData(rootRef) {
    rootRef.on('value', (snapshot)=> {
      this.setState({
        data: snapshot.val()
      });

      // var cats = this.state.data.categories.map((item, idx)=> {
      //   return item.title
      // });
      console.log(this.state.data.categories);
    }, (err)=> {
      console.log("that's an error: ", err.code);
    });
  },

  componentWillMount() {
    var rootRef = new Firebase('https://emoji-dev.firebaseio.com/');
    if (rootRef.getAuth()) {
      this.monitorRootData(rootRef);
      rootRef.onAuth(this.monitorUserState);
    } else {
      this.redirectToLogin();
    }
  },

  render() {
    return (
      <div className={styles.app}>
        <h1 className={styles.title}>this is a red title</h1>

      </div>
    );
  }
});

export default App