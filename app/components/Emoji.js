
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
      imgStatus: null
    }
  },

  handleImageLoaded() {
    this.setState({imgStatus: 'loaded'})
  },

  handleImageError() {
    this.setState({imgStatus: 'failed'})
  },

  render() {
    let {imgStatus} = this.state,
        {thumbnail, url} = this.props.photo,
        {position, isIOS, isAndroid} = this.props.emoji,
        photo = thumbnail ? `http://d3q6cnmfgq77qf.cloudfront.net/${thumbnail}` : url,
        loadingElement = imgStatus ? null : <Loader />,
        cellClass = imgStatus ? styles.cell : styles.cellLoading,
        connectDragSource = this.props.connectDragSource;

    return connectDragSource(
      <div className={cellClass}>
        {loadingElement}
        <img
          onLoad={this.handleImageLoaded}
          onError={this.handleImageError}
          className={styles.emojiPhoto}
          data-position={position}
          data-newpos={this.props.newPos}
          data-id={this.props.emoji_ID}
          src={photo} />
      </div>
    );
  }
});


export default DragSource(ItemTypes.EMOJI, EmojiSource, collect)(Emoji);




