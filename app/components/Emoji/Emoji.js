
import React from 'react';
import styles from './style.css';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import emojiQuery from '../../methods/emojiQuery';
import makeArray from '../../methods/makeArray';
import getObjectKeys from '../../methods/getObjectKeys';

//components
import Loader from '../Loader/Loader';

var Emoji = React.createClass({

  mixins: [ReactFireMixin],

  monitorEmojiData(emojiRef) {
    // emojiRef.on('value', (snapshot)=> {
    //   this.setState({
    //     data: snapshot.val()
    //   })
    // })
  },

  componentWillMount() {
    // var emojiRef = new Firebase('https://emoji-dev.firebaseio.com/emojis');
    // this.monitorEmojiData(emojiRef);
  },

  render() {
    return (
      <div className={styles.app}>
        {(() => {
          return <p>{this.props.emoji}</p>
          // return getObjectKeys(this.props.allEmojis).map((emoji, idx)=> {
          //   console.log(emoji);
          // });
        })()}
      </div>
    );
  }

});

export default Emoji