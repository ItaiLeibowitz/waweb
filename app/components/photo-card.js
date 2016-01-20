import Ember from 'ember';

export default Ember.Component.extend({
	mapService: Ember.inject.service('map-service'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	currentCollection: Ember.inject.service('current-collection'),
	classNames: ['photo-card'],
	classNameBindings: ['withInfo', 'isSaved', 'addedClass','isAd'],
	withInfo: false,
	addedClass: null,
	isSaved: function(){
		return this.get('currentCollection.itemIds').indexOf(this.get('model.id')) > -1;
	}.property('currentCollection.itemIds.[]','model.id'),
	isSaving: null,
	screenHeight: 0,

	resetAction: function(){},

	willDestroyElement: function () {
		if (this.get('withInfo')){
			this.set('stopScrollService.stopComponent.stopCardOpen', false);
		}
		this._super();
	},

	boundsForMap: function(){
		return {
			swLat: this.get('model.boundSwLat') || this.get('model.latitude') - 0.1,
			swLng: this.get('model.boundSwLng') || this.get('model.longitude') - 0.1,
			neLat: this.get('model.boundNeLat') || this.get('model.latitude') + 0.1,
			neLng: this.get('model.boundNeLng') || this.get('model.longitude') + 0.1
		}
	}.property('model.boundSwLat','model.boundSwLng','model.boundNeLat', 'model.boundNeLng', 'model.latitude', 'model.longitude'),

	attachMap: function(){
		var container = this.$('.map-holder')[0],
			mapService = this.get('mapService');
		mapService.moveDomToElement(container);
		mapService.changeCenter(this.get('model.latitude'), this.get('model.longitude'));
		mapService.setProperties({
			draggable: false,
			disableDefaultUI: true,
			bounds: this.get('boundsForMap')
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
	swipeLeft: function(){
		if (!this.get('withInfo')) {
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
			if (!this.get('isSaving')){
				this.set('isSaving', true);
				if (this.get('isSaved')) {
					this.get('currentCollection.currentEditable.items').removeObject(this.get('model'));
				} else {
					this.get('currentCollection.currentEditable.items').addObject(this.get('model'));
				}
				//TODO: fix this to happen in the promise
				this.set('isSaving', false);
			}
		}
	}
});