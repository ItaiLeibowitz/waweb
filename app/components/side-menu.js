import Ember from 'ember';

export default Ember.Component.extend({
	menuService: Ember.inject.service('menu-service'),
	mapService: Ember.inject.service('map-service'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	userService: Ember.inject.service('user-service'),
	user: Ember.computed.alias('userService.user'),
	signedIn: function(){
		return this.get('user') && !this.get('user.guest');
	}.property('user.guest'),

	classNames: ['side-menu'],
	classNameBindings: ['isOpen'],
	isOpen: Ember.computed.alias('menuService.leftMenuOpen'),

	swipeLeft: function () {
		this.set('isOpen', false);
		this.set('stopScrollService.stopMenuOpen', false);
	},

	actions:{
		toggleMenu: function(){
			this.toggleProperty('isOpen');
			if (this.get('isOpen')){
				this.set('stopScrollService.stopMenuOpen', true);
			} else {
				this.set('stopScrollService.stopMenuOpen', false);
			}
		},
		expandMap: function(){
			var mapService = this.get('mapService');
			mapService.set('bounds', mapService.get('mapBoundingBox'));
			//mapService.changeCenter(this.get('model.latitude'), this.get('model.longitude'));
			mapService.expandMap();
		},
		logout: function(){
			this.get('userService').reset();
		}
	}
});