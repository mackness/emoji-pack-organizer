import React from 'react'
import styles from '../css/style.css'

export default React.createClass({

  render() {
	  return (
	    <div className={styles.packListItem}>
	      <p style={{ backgroundColor: this.props.color }} className={styles.packItem}> {this.props.title} </p>
	    </div>
	  )
  }

});

