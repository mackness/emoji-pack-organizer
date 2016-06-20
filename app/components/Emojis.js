
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


export default React.createClass({

  mixins: [ReactFireMixin],

  getInitialState() {
    return {
      data: {},
    }
  },

  getEmojis(ref) {
    // ref.child('emojis').orderByChild('type').equalTo('-KGsouQg0HP9r8ny1Z-K').on('value', (snapshot)=> {
    ref.child('emojis').on('value', (snapshot)=> {
      this.setState({
        emojis: snapshot.val()
      })
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

  componentDidMount() {
  	console.log('damn fuckn right this component mounted m8')
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
	        if  (this.state.data && this.state.emojis) {
	        	if (this.state.data && this.state.categories) {
	        		if (this.state.data && this.state.photos) {
		        		return getObjectKeys(this.state.categories).map((category, idx)=> {
		        			if (category.obj.keyboard == this.props.params.keyboard_ID) {

											return (
												<div>
													<h3 className={styles.categoryTitle}>{category.obj.title}</h3>
													<div key={idx} className={styles.category}>

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


