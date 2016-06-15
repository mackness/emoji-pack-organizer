
import React from 'react'
import styles from './css/style.css'
import Firebase from 'firebase'
import ReactFireMixin from 'reactfire'

//components
import NavLink from './components/NavLink'

//methods
import getObjectKeys from './methods/getObjectKeys';


export default React.createClass({

  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      data: {}
    }
  },

  logout() {
    var ref = new Firebase('https://emoji-dev.firebaseio.com/');
    ref.unauth();
  },

  redirectToLogin() {
    window.location.replace(window.location.origin);
  },

  monitorUserState(data) {
    if (!data) {
      this.redirectToLogin();
    }
  },

  getPackData(ref) {
    ref.child('packs/').on('value', (snapshot)=> {
      console.log(snapshot.val());
    }, (err)=> {
      console.warn('error: ', err);
    })
  },

  componentWillMount() {
    var rootRef = new Firebase('https://emoji-dev.firebaseio.com/');
    if (rootRef.getAuth()) {
      rootRef.onAuth(this.monitorUserState);
      this.getPackData(rootRef);
    } else {
      this.redirectToLogin();
    }
  },

  render() {
    return (
      <div>
        <header className={styles.header}>
          <h3 className={styles.title}>pack editor ({this.props.params.keyboard_ID})</h3>
          <button onClick={this.logout} className={styles.logout}>Logout</button>
        </header>
        <nav className={styles.nav}>
          <ul role="nav" className={styles.navList}>
            <li><NavLink to={`/ra/${this.props.params.keyboard_ID}`} onlyActiveOnIndex={true}>Emojis</NavLink></li>
            <li><NavLink to={`/ra/${this.props.params.keyboard_ID}/stickers`}>Stickers</NavLink></li>
            <li><NavLink to={`/ra/${this.props.params.keyboard_ID}/gifs`}>Gifs</NavLink></li>
          </ul>
        </nav>
        <div className={styles.leftCol}>
          {this.props.params.keyboard_ID}
          {this.props.children}


        </div>
      </div>
    );
  }

});













