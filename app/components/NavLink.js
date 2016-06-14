// modules/NavLink.js
import React from 'react'
import { Link } from 'react-router'
import styles from '../css/style.css'

export default React.createClass({
  render() {
    return <Link {...this.props} activeStyle={{
    	background: 'white', 
    	color: '#189cb8',
    	padding: '4px',
    	borderRadius: '4px'
    }} />
  }
})