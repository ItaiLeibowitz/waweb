import Ember from 'ember';
import gmaps from 'waweb/appconfig/gmaps';

export default Ember.Service.extend({
	currentItem: Ember.inject.service('current-item'),
	constantOptions: {
		mapTypeControl: false,
		zoom: 3,
		maxZoom: 19,
		minZoom: 2,
		noClear: true,
		mapTypeControl: false,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false,
		//styles: gmaps.styles.originalStyles[0]
	},
	mapComponent: null,
	centerMarker: null,
	centerLat: 34.851939,
	centerLng: -82.399752,
	zoom: 15,
	draggable: true,
	disableDefaultUI: false,
	bounds: {swLat: -1, swLng: -1, neLat: 1, neLng: 1},
	lastHolder: null,

	center: function(){
		return new window.google.maps.LatLng(
			this.get('centerLat'),
			this.get('centerLng')
		)
	}.property('centerlLat', 'centerLng'),

	options: function(){
		return $.extend(this.get('constantOptions'), {
			center: this.get('center'),
			zoom: this.get('zoom'),
			draggable: this.get('draggable'),
			disableDefaultUI: this.get('disableDefaultUI')
		});
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
	},
	expandMap: function(currentElem){
		this.set('lastHolder', currentElem);
		this.set('lastItemCardPosition', this.get('currentItem.isOpen'));
		this.set('lastCurrentItem', this.get('currentItem.item'));
		this.set('currentItem.isOpen', false);
		$('#actual-map').appendTo('#expanded-map');
		$('#expanded-map').addClass('expanded');
		this.get('mapComponent').resizeMap();
		this.setProperties({
			draggable: true,
			disableDefaultUI: false
		})
	},
	minimizeMap: function(){
		$('#actual-map').appendTo(this.get('lastHolder'));
		this.get('currentItem').setProperties({
			isOpen: this.get('lastItemCardPosition'),
			item: this.get('lastCurrentItem'),
			withMap: true,
			withPhoto: false
		});
		this.get('mapComponent').resizeMap();
		$('#expanded-map').removeClass('expanded');
		this.setProperties({
			draggable: false,
			disableDefaultUI: true,
			bounds: this.get('bounds')
		})
	},

	openItemMenu: function(model){
		var currentItem = this.get('currentItem');
		currentItem.setProperties({
			item: model,
			isOpen: true,
			withMap: false,
			withPhoto: true,
			isAd: this.get('isAd'),
			currentListCard: null
		});
	}

});