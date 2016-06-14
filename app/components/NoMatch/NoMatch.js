
import React from 'react';
import styles from './style.css';

var NoMatch = React.createClass({

  render() {
    return (
      <div className={styles.app}>
        <h1>You are lost...</h1>
      </div>
    );
  }

});

export default NoMatch