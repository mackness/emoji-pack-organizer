
import React, {PropTypes} from 'react'
import styles from '../css/style.css'
import Firebase from 'firebase'
import {FirebaseConfig} from '../constants/constants'
import ReactFireMixin from 'reactfire'

//components
import NavLink from './NavLink'
import Loader from './Loader'
import DropSlot from './DropSlot'
import SaveButton from './SaveButton'

//methods
import getObjectKeys from '../methods/getObjectKeys'
import makeArray from '../methods/makeArray'
import _has from 'lodash.has'
import _sortBy from 'lodash.sortBy'
import _cloneDeep from 'lodash.cloneDeep'

export default React.createClass({

  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      data: {},
      isSaving: false
    }
  },

  //this takes the category object and emoji object 
  //from the state and creates an 'emojis' property on the category
  //object and pushes all the emojis that belong to it to an array
  handleSortingEmojis(props) {
  	if (_has(this.state, 'categories')) {
  		if (_has(this.state, 'emojis')) {
  			
  			let x = 0
  			let y = 0
  			let sorted = []
  			let {categories, emojis} = this.state

  			for (var cat in categories) {
  				sorted.push({
  					id: cat,
  					title: categories[cat].title,
  					keyboard: categories[cat].keyboard,
  					emojis: []
  				})
	  			for (var emoji in categories[cat].emojis) {
	  				emojis[emoji]['id'] = emoji
            if (_has(emojis[emoji], 'newPosition')) {
              sorted[x].emojis = _sortBy(sorted[x].emojis, 'newPosition')
            } else {
              emojis[emoji]['newPosition'] = y
            }
            sorted[x].emojis.push(emojis[emoji])
	  				y++
	  			}
          y = 0
	  			x++
  			}

        this.setState({
  				categorizedEmojis: sorted
  			})
			}
  	}
  },

  //this takes the sorted emoji array and updates the original emoji object
  //in the state that came from firebase with a new position property
  //the new position property is set in Emoji.js in the endDrag method
  updateSortedEmojis(sortedEmojis) {
    let {emojis} = this.state
    sortedEmojis.forEach((category, idx)=> {
      category.emojis.forEach((emoji, idx)=> {
        emojis[emoji.id]['newPosition'] = emoji['newPosition']
      })
    })

    this.setState({
      categorizedEmojis: sortedEmojis
    })
  },

  handleSave(event) {
    event.preventDefault()
    let {emojis} = this.state
    this.setState({saving: true})
    this.state.rootRef.child('emojis').set(emojis, (error)=> {
      if (error) {
        console.log('that\'s en error:', error)
        this.setState({
          saving: 'failed'
        })
      } else {
        console.log('emojis saved successfully')
        this.setState({saving: false})
        this.props.handleNotificaiton('show')
      }
    })
  },

  componentWillReceiveProps(props) {
  	this.handleSortingEmojis(props)
  },

  getEmojis(ref) {
    ref.child('emojis').on('value', (snapshot)=> {
      this.setState({
        emojis: snapshot.val()
      })
      this.handleSortingEmojis()
    }, (err)=> {
      console.warn('error: ', err);
    })
  },

  getCategories(ref) {
    ref.child('categories').orderByChild('keyboard').equalTo(this.props.params.keyboard_ID).on('value', (snapshot)=> {
      this.setState({
        categories: snapshot.val()
      })
      this.handleSortingEmojis()
    }, (err)=> {
      console.warn('error: ', err);
    })
  },

  getPhotos(ref) {
    ref.child('photos').on('value', (snapshot)=> {
      this.setState({
        photos: snapshot.val()
      })
    }, (err)=> {
      console.warn('error: ', err);
    })
  },

  componentWillMount() {
    var rootRef = new Firebase(FirebaseConfig.FIREBASE_URL)
    if (rootRef.getAuth()) {
      this.getEmojis(rootRef)
      this.getCategories(rootRef)
      this.getPhotos(rootRef)
      this.setState({
        rootRef
      })
    } else {
      this.redirectToLogin();
    }
  },

  extractPhoto(emoji) {
    for (let photoKey in this.state.emojis[emoji.id].photo) {
      var photo = this.state.photos[photoKey]
    }
    return photo
  },

  filterEmojisByActiveType(emoji) {
    if (this.props.activeType.key == this.state.emojis[emoji.id].type) {
    let {packs, emoji_ID} = this.props
    let {id} = emoji
    for (var pack in packs) {
      let {emojis} = packs[pack]
      if (emojis) {
        if (emojis.hasOwnProperty(id)) {
          return true
        }
      }
    }
    } else {
      return false
    }
  },

  filterCategoriesByActiveKeyboard(category) {
    if (category.keyboard == this.props.params.keyboard_ID) {
      return true
    } else {
      return false
    }
  },

  render() {
    return (
	    <div>
	      {(() => {
	      	let {categorizedEmojis} = this.state
	        if  (_has(this.state, 'photos')) {
	        	if (_has(this.state, 'categorizedEmojis')) {
	        		return categorizedEmojis.filter(this.filterCategoriesByActiveKeyboard).map((category, idx)=> {
								return (
									<div key={idx}>
										<h3 className={styles.categoryTitle}>{category.title}</h3>
                    <SaveButton 
                      handleSave={this.handleSave}
                      isSaving={this.state.saving}
                    />
										<div className={styles.category}>
											{(() => {
												if (categorizedEmojis[idx].emojis.length) {
													return categorizedEmojis[idx].emojis.filter(this.filterEmojisByActiveType).map((emoji, val)=> {

                            return (
                              <DropSlot
                                key={val}
                                newPosition={val}
                                photo={this.extractPhoto(emoji)}
                                packs={this.props.packs}
                                emoji_ID={emoji.id}
                                category_ID={category.id}
                                cellWidth={this.props.cellWidth}
                                emoji={this.state.emojis[emoji.id]}
                                updateSortedEmojis={this.updateSortedEmojis}
                                categorizedEmojis={this.state.categorizedEmojis}>
                                {this.props.children}</DropSlot>
                            )
                          
                          })
												}
											})()}
										</div>
									</div>
								)	
	        		});
        		}
	        } else {
	          return <Loader />
	        }
	      })()}
	    </div>
    );
  }
});


