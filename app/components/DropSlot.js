
import React, {PropTypes} from 'react'
import styles from '../css/style.css'
import { DropTarget } from 'react-dnd';
import {ItemTypes} from '../constants/constants'

//components
import Emoji from './Emoji'

const slotTarget = {
  canDrop(props) {
    console.log('[canDrop]', props)
    return true;
  },
  hover(props, monitor, component) {
    console.log('[hover]', props, monitor, component)
  },
  drop(props, monitor, dropComponent) {
    console.log('[drop]', dropComponent, props, monitor)
    return {
      oldPos: props, 
      dropComponent, 
      newPos: props,
      child: monitor
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

    let color = packColor ? packColor : null;
    if (color) {
      return connectDropTarget(
        <div 
          className={styles.dropTarget}
          style={{
            flex: `0 0 ${this.props.cellWidth}%`,
            borderColor: color
          }}>
          <Emoji 
            photo={this.props.photo}
            cellWidth={this.props.cellWidth}
            emoji_ID={this.props.emoji_ID}
            emoji={this.props.emoji} 
            newPos={this.state.newPos}
            cellWidth={this.props.cellWidth} />
        </div>
      )
    } else {
      return false
    }
  }
});

export default DropTarget(ItemTypes.EMOJI, slotTarget, collect)(DropSlot);