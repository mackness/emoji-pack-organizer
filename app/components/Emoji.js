
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
import _sortBy from 'lodash.sortBy'

var EmojiSource = {

  canDrag(props) {
    return true
  },
  
  beginDrag(props) {
    console.log('dragging')
    return {
      text: props
    };
  },

  endDrag(props, monitor, dragComponent) {
    if (monitor.didDrop()) {

      let sourceEmoji = dragComponent.props.emoji
      let targetEmoji = monitor.getDropResult().props.emoji
      let updated = []

      const updatedCategorizedEmojis = props.categorizedEmojis.map((category, x)=> {
        updated.push(category)
        return category.emojis.map((emoji, y)=> {
          if (emoji.id == sourceEmoji.id) {
            if (targetEmoji['newPosition'] < emoji['newPosition'])
              emoji['newPosition'] = (targetEmoji['newPosition'] - 0.5)
            else
              emoji['newPosition'] = (targetEmoji['newPosition'] + 0.5)
            updated[x].emojis[y] = emoji
            return emoji
          } else {
            updated[x].emojis[y] = emoji
            return emoji
          }
        }).sort((a,b)=> {
          if (a['newPosition'] > b['newPosition']) {
            return 1
          }
          if (a['newPosition'] < b['newPosition']) {
            return -1
          }
        }).map((emoji, idx)=> {
          emoji['newPosition'] = idx
          updated[x].emojis[idx] = emoji
          return emoji
        })
      })

      props.updateSortedEmojis(updated)
      
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

  componentWillMount() {
    // this.props.emoji['newPosition'] = this.props.newPosition
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
          emoji={this.props.emoji}
          onLoad={this.handleImageLoaded}
          onError={this.handleImageError}
          className={styles.emojiPhoto}
          data-id={this.props.emoji_ID}
          data-newposition={this.props.newPosition}
          src={photo} />
      </div>
    );
  }
});


export default DragSource(ItemTypes.EMOJI, EmojiSource, collect)(Emoji);




