import Ember from 'ember';

export default Ember.Component.extend({
	mapService: Ember.inject.service('map-service'),
	elementId: 'actual-map',
	classNames: ['map-holder'],
	classNameBindings: ['isOriginal'],
	googleMapObject: null,

	insertMap: function () {
		this.get('mapService').set('mapComponent', this);
		var container = this.$('.map-canvas')[0];
		var options = this.get('mapService.options');
		var map = new window.google.maps.Map(container, options);
		this.set('googleMapObject', map);
		var centerMarker = this.get('mapService.centerMarker');
		if (centerMarker) {
			centerMarker.get('_marker').setMap(map);
		}
	}.on('didInsertElement'),

	resizeMap: function(){
		Ember.run.scheduleOnce('afterRender', this, '_resizeMap');
	},

	_resizeMap: function(){
		google.maps.event.trigger(this.get('googleMapObject'), 'resize');
	},

	mapOptionsDidChange: function(){
		Ember.run.scheduleOnce('afterRender', this, 'updateOptions')
	}.observes('mapService.options'),

	mapBoundsDidChange: function(){
		Ember.run.scheduleOnce('afterRender', this, 'fitToBounds')
	}.observes('mapService.bounds'),

	updateOptions: function(){
		var options = this.get('mapService.options');
		this.get('googleMapObject').setOptions(options);
	},

	fitToBounds: function(){
		var bounds = this.get('mapService.bounds');
		var map = this.get('googleMapObject');
		var sw = new google.maps.LatLng(bounds.swLat, bounds.swLng);
		var ne = new google.maps.LatLng(bounds.neLat, bounds.neLng);

		map.fitBounds(new google.maps.LatLngBounds(sw, ne));
	}
});
