
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
    let photo = this.props.photo.thumbnail ? `http://d3q6cnmfgq77qf.cloudfront.net/${this.props.photo.thumbnail}` : this.props.photo.url
    return (
	    <div className={styles.cell}>
        <img className={styles.emojiPhoto} src={photo} />
        {this.props.position}
	    </div>
    );
  }

});