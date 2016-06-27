import React from 'react'
import styles from '../css/style.css'

export default React.createClass({

	changeHandler() {
		this.props.onChange(this.refs.range.value)
	},

  render() {
	  return (
	    <div className={styles.inputRange}>
			<input 
		  	type="range" 
		  	ref="range"
		  	value={this.props.value}
		  	onChange={this.changeHandler}
		  	step = "0.1"
		  	min="3.00" 
		  	max="10.71" />
	    </div>
	  )
  }

});

