import Ember from "ember";
import Utils from 'waweb/appconfig/utils';
import ItemsRouteMixin from 'waweb/mixins/items_route_mixin'


var ItemRoute = Ember.Route.extend({
	model: function(params) {
		var itemId = params.item_slug.split('-')[0];
		return this.store.find('item', itemId);
	},
	serialize: function(model) {
		return { item_slug: model.get('slug') };
	},
	renderTemplate: function(controller, model) {
		this._super(controller, model);
		this.render('item.overall', {   // the template to render
			into: 'application',                // the template to render into
			outlet: 'main',              // the name of the outlet in that template
		});
	},
	afterModel: function(item, transition) {
		if (Utils.itemTypeIsParent(item.get('itemType'))) {
			this.transitionTo('item.highlights')
		}
	}
});


export default ItemRoute;
