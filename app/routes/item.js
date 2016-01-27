import Ember from "ember";
import Utils from 'waweb/appconfig/utils';
import RouteWithMap from "waweb/mixins/route-with-map";


var ItemRoute = Ember.Route.extend(RouteWithMap, {
	model: function(params) {
		var itemId = params.item_slug.split('-')[0];
		return this.store.find('item', itemId);
	},
	serialize: function(model) {
		return { item_slug: model.get('slug') };
	},
	renderTemplate: function(controller, model) {
		this._super(controller, model);
		/*this.render('item.overall', {   // the template to render
			into: 'application',                // the template to render into
			outlet: 'main'              // the name of the outlet in that template
		});*/
		this.render('item.menu', {   // the template to render
			into: 'application',                // the template to render into
			outlet: 'page-specific',              // the name of the outlet in that template
			controller: controller        // the controller to use for the template
		});
	},
	setupController: function(controller, model){
		this._super(controller, model);
		//Setup map items
		var map = this.get('mapService');
		map.set('markerItems', [model]);
		map.set('centerMarkerModel', model);
	},
	afterModel: function(item, transition) {
		if (Utils.itemTypeIsParent(item.get('itemType'))) {
			this.transitionTo('item.highlights')
		}
	}
});


export default ItemRoute;
