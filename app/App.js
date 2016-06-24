
import React from 'react'
import styles from './css/style.css'
import Firebase from 'firebase'
import ReactFireMixin from 'reactfire'
import ReactEmoji from 'react-emoji'

//components
import NavLink from './components/NavLink'
import Loader from './components/Loader'
import Pack from './components/Pack'
import InputRange from './components/InputRange'

//methods
import getObjectKeys from './methods/getObjectKeys'
import makeArray from './methods/makeArray'
import _has from 'lodash.has'
import _cloneDeep from 'lodash.cloneDeep'


export default React.createClass({

  mixins: [
    ReactFireMixin,
    ReactEmoji
  ],

  getInitialState() {
    return {
      data: {},
      menu: true,
      text: ':100:',
      cellWidth: 10.71, 
      range : {
        min: 0,
        max: 20
      }
    }
  },

  getDefaultProps() {
    return {
      text: ":)",
      packColors: [
        '#34495e', 
        '#e74c3c',
        '#34495e',
        '#95a5a6',
        '#95a5a6',
        '#95a5a6'
      ]
    }
  },

  logout() {
    var ref = new Firebase('https://emoji-dev.firebaseio.com/');
    ref.unauth()
  },

  redirectToLogin() {
    window.location.replace(window.location.origin)
  },

  monitorUserState(data) {
    if (!data) {
      this.redirectToLogin()
    }
  },

  getPackData(ref) {
    ref.child('packs').on('value', (snapshot)=> {

      let obj = snapshot.val()
      let packObj = _cloneDeep(obj)
      let c = 0
      for (let pack in packObj) {
        packObj[pack].color =  this.props.packColors[c]
        c++
      }

      this.setState({
        packs: packObj
      })

    }, (err)=> {
      console.warn('error: ', err)
    })
  },

  getKeyboardData(ref) {
    ref.child(`keyboards/${this.props.params.keyboard_ID}`).on('value', (snapshot)=> {
      this.setState({
        keyboard: snapshot.val(),
      })
    }, (err)=> {
      console.warn('error: ', err)
    })
  },

  setActiveType() {
    getObjectKeys(this.state.keyboard.types).map((type, idx)=> {
      var title = this.state.types[type.key].title
      if (idx == 0) {
        this.setState({
          activeType: {
            key: type.key,
            title: title
          }
        })
      }
    })
  },

  getTypeData(ref) {
    ref.child('types').on('value', (snapshot)=> {
      this.setState({
        types: snapshot.val()
      })
      this.setActiveType()
    }, (err)=> {
      console.warn('error: ', err)
    })
  },

  componentWillMount() {
    var rootRef = new Firebase('https://emoji-dev.firebaseio.com/');
    if (rootRef.getAuth()) {
      rootRef.onAuth(this.monitorUserState)
      this.getPackData(rootRef)
      this.getKeyboardData(rootRef)
      this.getTypeData(rootRef)
    } else {
      this.redirectToLogin()
    }
  },

  updateActiveType(key, title, event) {
    event.preventDefault()
    this.setState({
      activeType: {
        key,
        title
      }
    })
  },

  handleRangeValueChange(cellWidth, event) {
    this.setState({
      cellWidth
    })
  },

  // {this.props.params.keyboard_ID}
  // {this.props.children}

  render() {
    let expanded = this.state.menu ? 'open' : 'closed'
    let keyboardTitle = this.state.data && this.state.keyboard ? this.state.keyboard.title : '[keyboard]'
    return (
      <div className={expanded}>
        <div className={styles.headerBlock}>
          <header className={styles.header}>
            <h3 className={styles.title}>{ReactEmoji.emojify(this.props.text)} pack editor ({`keyboard → ${keyboardTitle}`})</h3>
            <button onClick={this.logout} className={styles.logout}>Logout</button>
          </header>
          <nav className={styles.nav}>
            <ul role="nav" className={styles.navList}>
            {(() => {
              if (_has(this.state, 'keyboard')) {
                if (_has(this.state, 'types')) {
                  if(_has(this.state, 'activeType')) {
                    return getObjectKeys(this.state.keyboard.types).map((type, idx)=> {
                      let {title} = this.state.types[type.key]
                      let {key} = type
                      let active = key == this.state.activeType.key ? true : false
                      if (title != 'Recents') {
                        if (title != 'Purchases') {
                          return (
                            <li>
                              <NavLink 
                                key={idx} 
                                active={active} 
                                handleClick={this.updateActiveType.bind(this, key, title)}> {title} </NavLink>
                            </li>
                          )
                        }
                      }
                    })
                  }
                }
              }
            })()}
            </ul>
            <InputRange
              range={this.state.values}
              value={this.state.cellWidth}
              onChange={this.handleRangeValueChange} />
          </nav>
        </div>
        <div className={styles.leftCol}>

          <h3>Packs</h3>

          {(() => {
            if  (_has(this.state, 'packs')) {
              return makeArray(this.state.packs).map((item,idx) => {
                if (item.keyboard == this.props.params.keyboard_ID) {

                  return (
                    <Pack 
                      key={idx}
                      color={item.color}
                      title={item.title} /> 
                  )

                }
              })
            } else {
              return (
                <Loader />
              )
            }
          })()}
        
        </div>
        <div className={styles.rightCol}>

            {(() => {
              return React.Children.map(this.props.children,
               (child) => React.cloneElement(child, {
                 activeType: this.state.activeType,
                 packs: this.state.packs,
                 cellWidth: this.state.cellWidth
               })
              );
            })()}


        </div>
      </div>
    )
  }
})

