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
			var highlights = new Array(data.data.length);

			for (var i = 0; i < data.data.length; i++) {
				var item = store.push(store.normalize('item', data.data[i]));
				highlights[i] = item;
			}
			return highlights;
		});
	},
	renderTemplate: function(controller, model){
		this._super(controller, model);
		$(document).scrollTop(0);
	}

});


export default ItemHighlightsRoute;