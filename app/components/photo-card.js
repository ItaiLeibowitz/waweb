import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['photo-card'],
	classNameBindings: ['withInfo', 'addedClass'],
	withInfo: false,
	addedClass: null,

	actions:{
		toggleInfo: function(){
			this.toggleProperty('withInfo');
		}

	}
});