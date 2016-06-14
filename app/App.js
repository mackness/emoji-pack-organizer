
import React from 'react';
import styles from './style.css';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

//components
import Loader from './components/Loader/Loader';
import Category from './components/Category/Category';
import makeArray from './methods/makeArray';



var App = React.createClass({

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

  monitorRootData(rootRef) {
    rootRef.on('value', (snapshot)=> {
      this.setState({
        data: snapshot.val()
      });
    }, (err)=> {
      console.error("that's an error: ", err.code);
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
        {(() => {
          if  (this.state.data && this.state.data.categories) {
            return makeArray(this.state.data.categories).map((item,idx) => {
              return (
                <Category 
                  key={idx} 
                  title={item.title} 
                  categoryEmojis={item.emojis} 
                  allEmojis={this.state.data.emojis}
                />
              ); 
            });
          } else {
            return <Loader />
          }
        })()}
      </div>
    );
  }

});

export default App













