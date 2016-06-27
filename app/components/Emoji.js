
import React, {PropTypes} from 'react'
import styles from '../css/style.css'
import { Sortable } from 'react-sortable';
import {DragSource} from 'react-dnd' 
import {ItemTypes} from '../constants/constants'

//components
import Loader from './Loader'
import BrokenImage from './BrokenImage'

//methods
import getObjectKeys from '../methods/getObjectKeys'
import makeArray from '../methods/makeArray'

var EmojiSource = {
  canDrag(props) {
    return true
  },
  beginDrag(props) {
    return {
      text: props.text
    };
  },
  endDrag(props, monitor, dragComponent) {
    if (monitor.didDrop()) {
      let {oldPos, dropComponent, newPos, child} = monitor.getDropResult();
      debugger
    }
  }
}

var collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

let Emoji = React.createClass({

  PropTypes: {
    text: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
  },

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
    let {imgStatus, packColor} = this.state,
        {thumbnail, url} = this.props.photo,
        {position, isIOS, isAndroid} = this.props.emoji,
        photo = thumbnail ? `http://d3q6cnmfgq77qf.cloudfront.net/${thumbnail}` : url,
        loadingElement = imgStatus ? null : <Loader />,
        cellClass = imgStatus ? styles.cell : styles.cellLoading,
        color = packColor ? packColor : null,
        connectDragSource = this.props.connectDragSource;
        
        console.log('isDragging', this.props.isDragging)

    if (color) {
      return connectDragSource(
        <div className={cellClass}>
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


export default DragSource(ItemTypes.EMOJI, EmojiSource, collect)(Emoji);






