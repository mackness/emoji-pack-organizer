
import React from 'react'
import styles from '../css/style.css'
import Firebase from 'firebase'
import ReactFireMixin from 'reactfire'

//components
import NavLink from './NavLink'
import Loader from './Loader'
import Emoji from './Emoji'

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
      sortedEmojis: {}
    }
  },

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
  					emojis: []
  				})
	  			for (var emoji in categories[cat].emojis) {
	  				sorted[x].emojis.push(emojis[emoji])
	  				sorted[x].emojis = _sortBy(sorted[x].emojis, 'position')
	  				y++
	  			}
	  			x++
  			}

  			this.setState({
  				sortedEmojis: sorted
  			})

			}
  	}
  },

  componentWillReceiveProps(props) {
  	this.handleSortingEmojis(props)
  },

  getEmojis(ref) {
    // ref.child('emojis').orderByChild('type').equalTo('-KGsouQg0HP9r8ny1Z-K').on('value', (snapshot)=> {
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
    // ref.child('categories').on('value', (snapshot)=> {
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
    var rootRef = new Firebase('https://emoji-dev.firebaseio.com/')
    if (rootRef.getAuth()) {
      this.getEmojis(rootRef)
      this.getCategories(rootRef)
      this.getPhotos(rootRef)
    } else {
      this.redirectToLogin();
    }
  },

  render() {
    return (
	    <div>
	      {(() => {
	        if  (_has(this.state, 'emojis')) {
	        	if (_has(this.state, 'categories')) {
	        		if (_has(this.state, 'photos')) {
	        			let x = getObjectKeys(this.state.categories)
	        			debugger 
		        		return getObjectKeys(this.state.categories).map((category, idx)=> {
		        			if (category.obj.keyboard == this.props.params.keyboard_ID) {

											return (
												<div key={idx}>
													<h3 className={styles.categoryTitle}>{category.obj.title}</h3>
													<div className={styles.category}>

														{(() => {
															if (category.obj.emojis) {
																return getObjectKeys(category.obj.emojis).map((categoryEmoji, idx)=> {
																	let {key} = categoryEmoji
																	for (var photoKey in this.state.emojis[key].photo) {
																		var photo = this.state.photos[photoKey]
																	}
																	if (this.props.activeType.key == this.state.emojis[key].type) {
																		return (
																			<Emoji
																				key={idx}
																				photo={photo}
																				packs={this.props.packs}
																				emoji_ID={key}
																				emoji={this.state.emojis[key]} />
																		)
																	}
																});
															}
														})()}

													</div>
												</div>
											)
		        				
		        				}
		        		});
	        		}
	        	}
	        } else {
	          return <Loader />
	        }
	      })()}
	    </div>
    );
  }

});


