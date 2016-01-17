import Ember from "ember";
import Utils from 'waweb/appconfig/utils';


export default Ember.Route.extend({
	model: function(params) {
		var collectionToken = params.collection_slug.split('-')[0];
		return this.store.find('collection', collectionToken);
	},
	serialize: function(model) {
		return { collection_slug: model.get('slug') };
	}
});


