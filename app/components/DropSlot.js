
import React, {PropTypes} from 'react'
import styles from '../css/style.css'
import { DropTarget } from 'react-dnd';
import {ItemTypes} from '../constants/constants'

//components
import Emoji from './Emoji'

const slotTarget = {
  canDrop(props) {
    // console.log('[canDrop]', props)
    return true;
  },
  
  hover(props, monitor, component) {
    // console.log('[hover]', props, monitor, component)
  },
  
  drop(props, monitor, dropComponent) {
    return {
      component: dropComponent, 
      props: props
    }
  }
}

let collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}

let DropSlot = React.createClass({

  getInitialState() {
    return {
      packColor: null,
      newPos: 0, 
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

  render() {
    const { connectDropTarget, isOver } = this.props,
          { packColor } = this.state;

      return connectDropTarget(
        <div 
          className={styles.dropTarget}
          style={{
            flex: `0 0 ${this.props.cellWidth}%`,
            borderColor: packColor
          }}>
          <Emoji 
            photo={this.props.photo}
            emoji_ID={this.props.emoji_ID}
            category_ID={this.props.category_ID}
            emoji={this.props.emoji} 
            newPosition={this.props.newPosition}
            cellWidth={this.props.cellWidth} 
            updateSortedEmojis={this.props.updateSortedEmojis}
            categorizedEmojis={this.props.categorizedEmojis} />
        </div>
      )
    } 
});

export default DropTarget(ItemTypes.EMOJI, slotTarget, collect)(DropSlot);





