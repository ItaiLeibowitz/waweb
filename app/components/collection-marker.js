import Ember from 'ember';
import gmaps from 'waweb/appconfig/gmaps';
import MapMarker from 'waweb/components/map-marker'

export default MapMarker.extend({
	visible: true,
	map: Ember.computed.alias('mapService.mapComponent.googleMapObject'),
	baseDepth: 2,
	addedLabelClass: 'collection',


	lat: Ember.computed.alias('model.latitude'),
	lng: Ember.computed.alias('model.longitude'),
	labelName: Ember.computed.alias('model.name'),
	labelType: Ember.computed.alias('model.itemTypeName'),
	labelOneliner: Ember.computed.alias('model.onelinerOrAlt'),
	itemImageStyle: Ember.computed.alias('model.smallImageStyle'),



	clickMarker: function(e){
		if ($(e.target).hasClass('read-more')) {
			this.openItemMenu();
		}
		var currentSetting = this.get('isExpanded');
		if (this.get('minimizeAllAction')) { this.get('minimizeAllAction')()}
		this.set('isExpanded', !currentSetting);
		if (!currentSetting == true) {
			// here we calculate the XY position needed to offset the marker left by half its width, which is 100px
			// change the "100/512" here if the styling of the marker with label changes width
			// 512 is a constant based on google maps tile size
			var map = this.get('map'),
				zoomLevel = map.getZoom(),
				zoomFactor = Math.pow(2,zoomLevel),
				p = map.getProjection(),
				markerPos = this.get('_marker').getPosition(),
				xyOrig = p.fromLatLngToPoint(markerPos),
				xyNew = new google.maps.Point(xyOrig.x  + 100 / zoomFactor, xyOrig.y),
				latLngNew = p.fromPointToLatLng(xyNew);
			map.panTo(latLngNew);
		}
	},

	openItemMenu: function() {
		this.get('mapService').openItemMenu(this.get('model'));
	},

	init: function(){
		this._super();
		var map = this.get('mapService.mapComponent');
		if (map) {
			console.log('already has map')
		} else {
			console.log('map not ready')
		}
	},

	unhoveredIcon: gmaps.markerIcons.smallOrange,
});

