
import React, {PropTypes} from 'react'
import styles from '../css/style.css'
import { DropTarget } from 'react-dnd';
import {ItemTypes} from '../constants/constants'

//components
import Emoji from './Emoji'

const spec = {
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
  render() {
    const { connectDropTarget, isOver } = this.props
    return connectDropTarget(
      <div className={styles.dropTarget} style={{flex: `0 0 ${this.props.cellWidth}%`}}>
        <Emoji 
          photo={this.props.photo}
          cellWidth={this.props.cellWidth}
          packs={this.props.packs}
          emoji_ID={this.props.emoji_ID}
          emoji={this.props.emoji} />
      </div>
    )
  }
});

export default DropTarget(ItemTypes.EMOJI, spec, collect)(DropSlot);