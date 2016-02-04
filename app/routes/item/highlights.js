import Ember from "ember";
import Utils from 'waweb/appconfig/utils';
import ItemsRouteMixin from 'waweb/mixins/items_route_mixin';
import RouteWithMap from "waweb/mixins/route-with-map";


var ItemHighlightsRoute = Ember.Route.extend(ItemsRouteMixin, RouteWithMap, {
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
	setupController: function(controller, model){
		this._super(controller, model);
		var mainItem  = this.modelFor('item');
		controller.set('mainItem', mainItem);
		//Setup map items
		var map = this.get('mapService');
		map.set('markerItems', model);
		// page description
		if (Utils.itemTypeIsCountry(mainItem.get('itemType'))) {
			var itemType = "places to visit"
		} else {
			var itemType = "things to do"
		}
		controller.set('pageDescription', `${model.length} great ${itemType} in...`);
		//Photo array
		var photosArr = model.map(function(item){ return {image:item.get('largeImageStyle'), id:item.get('id')}});
		var n = photosArr.length;
		controller.set('photoArray', photosArr);
	},
	renderTemplate: function(controller, model){
		this._super(controller, model);
		$(document).scrollTop(0);
	},
});


export default ItemHighlightsRoute;