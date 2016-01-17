import Ember from 'ember';

export default Ember.Component.extend({
	mapService: Ember.inject.service('map-service'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	classNames: ['photo-card'],
	classNameBindings: ['withInfo', 'isSaved', 'addedClass'],
	withInfo: false,
	addedClass: null,
	isSaved: false,

	resetAction: function(){},

	attachMap: function(){
		var container = this.$('.map-holder')[0],
			mapService = this.get('mapService');
		mapService.moveDomToElement(container);
		mapService.changeCenter(this.get('model.latitude'), this.get('model.longitude'));
		mapService.setProperties({
			draggable: false,
			disableDefaultUI: true,
			bounds: {
				swLat: this.get('model.boundSwLat'),
				swLng: this.get('model.boundSwLng'),
				neLat: this.get('model.boundNeLat'),
				neLng: this.get('model.boundNeLng')
			}
		});
		mapService.get('centerMarker').setProperties({
			lat: this.get('model.latitude'),
			lng: this.get('model.longitude')
		});
	},

	swipeRight: function(){
		if (this.get('withInfo')) {
			this.send('toggleInfo');
			return false;
		}
	},

	actions:{
		toggleInfo: function(){
			var currentState = this.get('withInfo');
			this.get('resetAction')();
			this.set('withInfo', !currentState);
			if (this.get('withInfo')) {
				this.attachMap();
				this.set('stopScrollService.stopComponent.stopCardOpen', true);
			} else {
				this.set('stopScrollService.stopComponent.stopCardOpen', false);
			}
		},
		toggleSaved: function(){
			this.toggleProperty('isSaved');
		}
	}
});