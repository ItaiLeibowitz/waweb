export default Ember.Service.extend({
	mapComponent: null,
	centerLat: 34.851939,
	centerLng: -82.399752,
	zoom: 15,
	draggable: true,
	disableDefaultUI: false,
	bounds: {swLat: -1, swLng: -1, neLat: 1, neLng: 1},

	center: function(){
		return new window.google.maps.LatLng(
			this.get('centerLat'),
			this.get('centerLng')
		)
	}.property('centerlLat', 'centerLng'),

	options: function(){
		return {
			center: this.get('center'),
			zoom: this.get('zoom'),
			draggable: this.get('draggable'),
			disableDefaultUI: this.get('disableDefaultUI')
		}
	}.property('center','zoom', 'draggable', 'disableDefaultUI'),

	moveDomToElement: function(elem){
		$('#actual-map').appendTo(elem);
		var map = this.get('mapComponent.googleMapObject');
		google.maps.event.trigger(map, 'resize');
	},
	changeCenter: function(lat, lng){
		this.setProperties({
			centerLat: lat,
			centerLng: lng
		});
	}

});