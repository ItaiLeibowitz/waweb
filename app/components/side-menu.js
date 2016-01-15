import Ember from 'ember';

export default Ember.Component.extend({
	menuService: Ember.inject.service('menu-service'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	classNames: ['side-menu'],
	classNameBindings: ['isOpen'],
	isOpen: Ember.computed.alias('menuService.leftMenuOpen'),


	actions:{
		toggleMenu: function(){
			this.toggleProperty('isOpen');
			if (this.get('isOpen')){
				this.set('stopScrollService.stopComponent.stopMenuOpen', true);
			} else {
				this.set('stopScrollService.stopComponent.stopMenuOpen', false);
			}
		}
	}
});