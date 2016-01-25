import Ember from "ember";

export default Ember.Route.extend({
	currentCollection: Ember.inject.service('current-collection'),
	currentUser: Ember.inject.service('user-service'),
	mapService: Ember.inject.service('map-service'),
	model: function(params) {
		var collectionToken = params.collection_slug.split('-')[0];
		var self = this;
		return this.store.find('collection', collectionToken).then(function(collection){
			self.get('currentCollection').set('currentViewed', collection);
			return collection;
		})
	},
	setupController: function(controller, model){
		this._super(controller, model);
		controller.set('items', model.get('items'));
		var map = this.get('mapService');
		map.set('markerItems', model.get('items'))
	},
	serialize: function(model) {
		return { collection_slug: model.get('slug') };
	},
	renderTemplate: function(controller, model){
		this._super(controller, model);
		$(document).scrollTop(0);
	}
});


