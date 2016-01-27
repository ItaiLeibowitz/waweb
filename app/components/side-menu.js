import Ember from 'ember';

export default Ember.Component.extend({
	menuService: Ember.inject.service('menu-service'),
	mapService: Ember.inject.service('map-service'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	userService: Ember.inject.service('user-service'),
	user: Ember.computed.alias('userService.user'),
	classNames: ['side-menu'],
	classNameBindings: ['isOpen'],
	isOpen: Ember.computed.alias('menuService.leftMenuOpen'),

	swipeLeft: function () {
		this.set('isOpen', false);
		this.set('stopScrollService.stopComponent.stopMenuOpen', false);
	},

	actions:{
		toggleMenu: function(){
			this.toggleProperty('isOpen');
			if (this.get('isOpen')){
				this.set('stopScrollService.stopComponent.stopMenuOpen', true);
			} else {
				this.set('stopScrollService.stopComponent.stopMenuOpen', false);
			}
		},
		expandMap: function(){
			var mapService = this.get('mapService');
			mapService.set('bounds', mapService.get('mapBoundingBox'));
			//mapService.changeCenter(this.get('model.latitude'), this.get('model.longitude'));
			mapService.expandMap();
		}
	}
});