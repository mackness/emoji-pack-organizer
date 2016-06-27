
import React from 'react';
import styles from './App.css';
import ReactFireMixin from 'reactfire';


var App = React.createClass({

  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      test: 'foo'
    }
  },

  componentWillMount() {
    var ref = new Firebase("https://development-d03f4.firebaseio.com/categories");
    this.bindAsArray(ref, 'categories');
  },

  componentWillUnmount() {
    this.firebaseRef.off();
  },

  render() {
    return (
      <div className={styles.app}>
        {JSON.stringify(this.state)}
      </div>
    );
  }
});

export default App;
