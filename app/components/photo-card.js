import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['photo-card'],
	classNameBindings: ['withInfo', 'addedClass'],
	withInfo: false,
	addedClass: null,

	resetAction: function(){},

	actions:{
		toggleInfo: function(){
			var currentState = this.get('withInfo');
			this.get('resetAction')();
			this.set('withInfo', !currentState);
		}
	}
});