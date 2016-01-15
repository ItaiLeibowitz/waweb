import Ember from 'ember';
import gmaps from 'waweb/appconfig/gmaps';

var MapMarker =  Ember.Component.extend({
	mapService: Ember.inject.service('map-service'),

	// static properties
	model: null,
	id: null,
	anchorPoint: new google.maps.Point(0, 0),
	labelAnchor: new google.maps.Point(0, 0),
	defaultLabelClass: 'map-marker',
	addedLabelClass: null,
	baseDepth: 1,
	_marker: null,

	// dynamic properties
	lat: 0,
	lng: 0,
	position: function(){
		return new google.maps.LatLng(this.get('lat'), this.get('lng'));
	}.property('lat', 'lng'),
	map: null,
	visible: false,
	clickable: true,
	draggable: false,

	hovered: false,
	itemIsHovered: false,
	enlarged: false,

	labelName: null,
	labelType: null,
	labelOneliner: null,
	labelImageStyle: null,

	hoveredIcon: gmaps.markerIcons.dot,
	unhoveredIcon: gmaps.markerIcons.dot,


	init: function () {
		this._super();
		var marker = new MarkerWithLabel(this._initOptions());
		this.set('_marker', marker);
		this._setListeners(marker);
		this._setObservers();
	},

	icon: function () {
		return (this.get('hovered') ? this.get('hoveredIcon') : this.get('unhoveredIcon'));
	}.property('hovered', 'unhoveredIcon'),

	_initOptions: function() {
		return this.getProperties(Ember.String.w('id anchorPoint icon position map visible clickable draggable labelAnchor labelName labelClass labelContent zIndex'));
	},

	_setListeners: function(marker) {
		var self = this;
		google.maps.event.addListener(marker, 'click', function(){
			self.clickMarker();
		});
		google.maps.event.addListener(marker, 'mouseover', function(){
			self.set('hovered', true);
		});
		google.maps.event.addListener(marker, 'mouseout', function(){
			self.set('hovered', false);
		});
		google.maps.event.addListener(marker, 'dragend', function(){
			console.log(marker.getPosition().lat(), marker.getPosition().lng())
			self.model.setProperties({
				latitude: marker.getPosition().lat(),
				longitude: marker.getPosition().lng()
			})
		});
	},

	_setObservers: function() {
		var self = this;

		// keys that have a matching setKey(value) function on the _marker
		var observableKeys = Ember.String.w('clickable draggable icon position map visible zIndex');
		observableKeys.forEach(function(key) {
			self.addObserver(key, function() {
				Ember.run.once(self.get('_marker'), 'set' + key.capitalize(), self.get(key));
			});
		});

		// keys that don't have a setKey function on the _marker use setKey on self
		var optionsKeys = Ember.String.w('labelClass labelContent');
		optionsKeys.forEach(function(key) {
			self.addObserver(key, function() {
				Ember.run.once(self, '_set' + key.capitalize(), self.get(key));
			});
		});
	},

});


export default MapMarker;