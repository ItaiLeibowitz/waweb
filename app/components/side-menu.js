import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['side-menu'],
	classNameBindings: ['isOpen'],
	isOpen: false,


	actions:{
		toggleMenu: function(){
			this.toggleProperty('isOpen');
		}
	}
});