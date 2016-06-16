
import React from 'react'
import styles from '../css/style.css'

//components
import Loader from './Loader'

//methods
import getObjectKeys from '../methods/getObjectKeys'
import makeArray from '../methods/makeArray'


export default React.createClass({

  getInitialState() {
    return {
      data: {},
    }
  },

  render() {
    return (
	    <div className={styles.cell}>
        {this.props.emoji.obj.title}
	    </div>
    );
  }

});

