import Ember from 'ember';
import gmaps from 'waweb/appconfig/gmaps';
import MapMarker from 'waweb/components/map-marker'

export default MapMarker.extend({
	currentCollection: Ember.inject.service('current-collection'),
	visible: Ember.computed.bool('model.latitude'),
	map: Ember.computed.alias('mapService.mapComponent.googleMapObject'),
    baseDepth: 0,
	addedLabelClass: 'center',
	model: Ember.computed.alias('mapService.centerMarkerModel'),


	lat: Ember.computed.alias('model.latitude'),
	lng: Ember.computed.alias('model.longitude'),
	labelName: Ember.computed.alias('model.name'),
	labelType: Ember.computed.alias('model.itemTypeName'),
	labelOneliner: Ember.computed.alias('model.onelinerOrAlt'),
	itemImageStyle: Ember.computed.alias('model.smallImageStyle'),

	init: function(){
		this._super();
		this.get('mapService').set('centerMarker', this);
		var map = this.get('mapService.mapComponent');
		if (map) {
			console.log('already has map')
		} else {
			console.log('map not ready')
		}
	},

	clickMarker: function(){
		this.get('mapService').minimizeMap();
	},

	collItemsDidChange: function(){
		var isInCollection = this.get('currentCollection.itemIds').indexOf(this.get('model.id')) > -1;
		if (isInCollection) {
			this.setProperties({
				addedLabelClass: 'center collection',
				unhoveredIcon: gmaps.markerIcons.largeOrange
			})
		} else {
			this.setProperties({
				addedLabelClass: 'center',
				unhoveredIcon: gmaps.markerIcons.largeRed
			})
		}
	}.observes('currentCollection.itemIds.[]', 'model.id').on('init'),

	unhoveredIcon: gmaps.markerIcons.largeRed,
});

