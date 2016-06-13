import React from 'react';
import styles from './App.css';
import Firebase from 'firebase';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {test: 'foo'};
  }
  componentWillMount() {
    var ref = new Firebase('https://emoji-dev.firebaseio.com/');
    if (!ref.getAuth()) {
      window.location.replace(window.location.origin);
    }
  }
  render() {
    return (
      <div className={styles.app}>
        bar
      </div>
    );
  }
}
