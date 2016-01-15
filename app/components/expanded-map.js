import Ember from 'ember';

export default Ember.Component.extend({
	mapService: Ember.inject.service('map-service'),
	elementId: 'expanded-map',
	actions:{
		minimizeMap: function(){
			this.get('mapService').minimizeMap();
		}
	}
});