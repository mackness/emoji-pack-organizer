// modules/NavLink.js
import React from 'react'
import styles from '../css/style.css'

//components
import Loader from './Loader'

export default React.createClass({
  render() {
		if (this.props.isSaving) {
			var button = <a href="#" onClick={this.props.handleSave} className={styles.save}><Loader /></a>
		} else {
			var button = <a href="#" onClick={this.props.handleSave} className={styles.save}><span>Update Layout</span></a>
		}
    return (
    	<div>
    		{button}
    	</div>
    );
  }
})