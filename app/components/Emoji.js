
import React from 'react'
import styles from '../css/style.css'
import { Sortable } from 'react-sortable';

//components
import Loader from './Loader'
import BrokenImage from './BrokenImage'

//methods
import getObjectKeys from '../methods/getObjectKeys'
import makeArray from '../methods/makeArray'


export default React.createClass({

  getInitialState() {
    return {
      data: {},
      imgStatus: null,
      packColor: null
    }
  },

  componentWillMount() {
    let {packs, emoji_ID} = this.props

    for (var pack in packs) {
      let {emojis} = packs[pack]
      if (emojis) {
        if (emojis.hasOwnProperty(emoji_ID)) {
          this.setState({
            packColor: packs[pack].color
          })
        }
      }
    }
  },

  handleImageLoaded() {
    this.setState({imgStatus: 'loaded'})
  },

  handleImageError() {
    this.setState({imgStatus: 'failed'})
  },

  render() {
    let {imgStatus, packColor} = this.state
    let {thumbnail, url} = this.props.photo
    let {position, isIOS, isAndroid} = this.props.emoji

    let photo = thumbnail ? `http://d3q6cnmfgq77qf.cloudfront.net/${thumbnail}` : url
    let loadingElement = imgStatus ? null : <Loader />
    let cellClass = imgStatus ? styles.cell : styles.cellLoading
    let color = packColor ? packColor : null

    if (color) {
      return (
        <div className={cellClass} style={{flex: `0 0 ${this.props.cellWidth}%`}} >
          {loadingElement}
          <img
            onLoad={this.handleImageLoaded}
            onError={this.handleImageError}
            className={styles.emojiPhoto}
            data-position={position}
            data-id={this.props.emoji_ID}
            src={photo}
            style={{borderColor: color}} />
        </div>
      );
    } else {
      return false
    }
  }

});







