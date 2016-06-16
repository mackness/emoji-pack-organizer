
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
    ref.child('emojis').on('value', (snapshot)=> {
      this.setState({
        emojis: snapshot.val()
      })
    }, (err)=> {
      console.warn('error: ', err);
    })
  },

  getCategories(ref) {
    ref.child('categories').on('value', (snapshot)=> {
      this.setState({
        categories: snapshot.val()
      })
    }, (err)=> {
      console.warn('error: ', err);
    })
  },

  componentWillMount() {
    var rootRef = new Firebase('https://emoji-dev.firebaseio.com/');
    if (rootRef.getAuth()) {
      this.getEmojis(rootRef)
      this.getCategories(rootRef)
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
	        		return getObjectKeys(this.state.categories).map((category, idx)=> {
	        			if (category.obj.keyboard == this.props.params.keyboard_ID) {
										
										return (
											<div key={idx}>
											<h3>{category.obj.title}</h3>

											{(() => {
												if (category.obj.emojis) {
													return getObjectKeys(category.obj.emojis).map((categoryEmojis, idx)=> {
														return getObjectKeys(this.state.emojis).map((emoji, idx) => {

															if (categoryEmojis.key == emoji.key) {
																return (
																	<Emoji
																		key={idx}
																		emoji={emoji}
																	/>	
																)
															}
														
														});
													});
												}
											})()}
											
											</div>
										)
	        				
	        				}
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


