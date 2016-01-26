import Ember from 'ember';
import gmaps from 'waweb/appconfig/gmaps';
import MapMarker from 'waweb/components/map-marker'

export default MapMarker.extend({
	visible: true,
	map: Ember.computed.alias('mapService.mapComponent.googleMapObject'),
    baseDepth: 0,

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

	unhoveredIcon: gmaps.markerIcons.largeRed,
});

