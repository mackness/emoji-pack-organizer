
import React from 'react';
import styles from './style.css';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';

//methods
import emojiQuery from '../../methods/emojiQuery';
import makeArray from '../../methods/makeArray';
import getObjectKeys from '../../methods/getObjectKeys';

//components
import Loader from '../Loader/Loader';
import Emoji from '../Emoji/Emoji';

var Category = React.createClass({

  mixins: [ReactFireMixin],

  render() {
    return (
      <div className={styles.app}>
        <h3 className={styles.title}>{this.props.title}</h3>
        {(() => {
          return getObjectKeys(this.props.categoryEmojis).map((emoji, idx)=> {
            return <Emoji key={idx} emoji={emoji} allEmojis={this.props.allEmojis} />
          });
        })()}
      </div>
    );
  }

});

export default Category