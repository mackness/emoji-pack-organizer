// modules/NavLink.js
import React from 'react'
import { Link } from 'react-router'
import styles from '../css/style.css'

export default React.createClass({
  render() {
  	let active = this.props.active ? styles.active : ''
    return (
    	<a href="#" onClick={this.props.handleClick} className={active}>{this.props.children}</a>
    );
  }
})