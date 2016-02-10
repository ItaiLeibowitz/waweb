import Ember from "ember";
import Utils from 'waweb/appconfig/utils';
import ItemsRouteMixin from 'waweb/mixins/items_route_mixin';
import RouteWithMap from "waweb/mixins/route-with-map";
import ItemMetaSetup from 'waweb/mixins/item-meta-setup';


export default Ember.Route.extend(ItemsRouteMixin, RouteWithMap, ItemMetaSetup, {
	wanderantUrlKey: 'destinations',
	pageDescription: function(){
		return 'Great destinations to explore in...'
	},
	addedControllerProperties: {
		loadMore: true,
		withIndex: false,
		withMoreHolder: false
	}
});


