import Ember from 'ember';

export default Ember.Component.extend({
	mapService: Ember.inject.service('map-service'),
	classNames: ['map-holder'],
	withExpand: false,
	willDestroyElement: function(){
		var includedMap = this.$('.map-canvas')[0];
		if (includedMap) {
			$('#actual-map').appendTo('#original-map-placeholder');
		}
	},
	actions:{
		expandMap: function(){
			this.get('mapService').expandMap(this.$());
			ga('send', 'event', 'map', 'size', 'expand');
		}
	}
});