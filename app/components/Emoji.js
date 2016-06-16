
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
        <img src={this.props.photo.url} />
        {this.props.emoji.title}
	    </div>
    );
  }

});

