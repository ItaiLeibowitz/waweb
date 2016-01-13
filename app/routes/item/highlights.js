import Ember from "ember";
import Utils from 'waweb/appconfig/utils';
import ItemsRouteMixin from 'waweb/mixins/items_route_mixin'

var ItemHighlightsRoute = Ember.Route.extend(ItemsRouteMixin, {
	wanderantUrlKey: 'highlights',
	beforeModel: function() {
		this.set('mainItem', this.modelFor('item'));
		this.set('mainItemId', this.modelFor('item').get('id'));
	},
	model: function(params){
		var self = this,
			item = this.get('mainItem'),
			store = this.get('store');
		return this._getWanderantItems().then(function(data) {
			if (data.data.length > 6) {

				var highlights = new Array(data.data.length);

				for (var i = 0; i < data.data.length; i++) {
					var item = store.push(store.normalize('item', data.data[i]));
					highlights[i] = item
				};
/*
				// load items
				var dataToPush = store.normalize('item', data);
				var highlights = store.push(dataToPush);
*/



				return highlights;
			}
		});
	}

});


export default ItemHighlightsRoute;