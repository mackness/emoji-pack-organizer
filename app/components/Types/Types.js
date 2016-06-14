
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
        <h1>types</h1>
      </div>
    );
  }

});

export default Category