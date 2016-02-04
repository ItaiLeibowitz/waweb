import Ember from "ember";
import RouteWithMap from "waweb/mixins/route-with-map";


export default Ember.Route.extend(RouteWithMap, {
	currentCollection: Ember.inject.service('current-collection'),
	currentUser: Ember.inject.service('user-service'),
	model: function(params) {
		var collectionToken = params.collection_slug.split('-')[0];
		var self = this;
		// See if we have the record - if it is partial, then reload it.
		var collection = this.store.peekRecord('collection', collectionToken);
		if (collection && !collection.get('partial')) {
			self.get('currentCollection').set('currentViewed', collection);
			return collection;
		} else {
			return this.store.findRecord('collection', collectionToken, {reload: true}).then(function (foundCollection) {
				self.get('currentCollection').set('currentViewed', foundCollection);
				return foundCollection;
			});
		}
	},
	setupController: function(controller, model){
		this._super(controller, model);
		controller.set('items', model.get('items'));
		//Setup map items
		var map = this.get('mapService');
		map.set('markerItems', model.get('items'));
		//Photo array
		var photosArr = model.get('items').map(function(item){ return {image:item.get('largeImageStyle'), id:item.get('id')}});
		var n = photosArr.length;
		controller.set('photoArray', photosArr);
	},
	serialize: function(model) {
		return { collection_slug: model.get('slug') };
	},
	scrollViewToTop: true
});


