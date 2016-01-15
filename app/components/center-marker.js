import Ember from 'ember';
import gmaps from 'waweb/appconfig/gmaps';
import MapMarker from 'waweb/components/map-marker'

export default MapMarker.extend({
	visible: true,

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

