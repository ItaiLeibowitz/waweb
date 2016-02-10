import Ember from "ember";
import Utils from 'waweb/appconfig/utils';
import ItemsRouteMixin from 'waweb/mixins/items_route_mixin';


var ItemHighlightsRoute = Ember.Route.extend(ItemsRouteMixin, {
	wanderantUrlKey: 'highlights',
	pageDescription: function(mainItem, model){
		if (Utils.itemTypeIsCountry(mainItem.get('itemType'))) {
			var itemType = "places to visit"
		} else {
			var itemType = "things to do"
		}
		return `${model.get('length')} great ${itemType} in...`
	},
	afterModel: function(model, transition){
		this._super(model, transition)
		var moreHolderLinks = [
			{target: "item.attractions", name: "Attractions to visit"}
		];
		if (Utils.itemTypeIsRegion(this.get('mainItem.itemType'))){
			moreHolderLinks.unshift(
				{target: "item.destinations", name: "Destinations to explore"}
			)
		}
		this.set('moreHolderLinks', moreHolderLinks);
	},
	addedControllerProperties: function(){
		return {
			withIndex: true,
			withMoreHolder: true,
			moreHolderLinks: this.get('moreHolderLinks')
		}
	}.property('moreHolderLinks')


});


export default ItemHighlightsRoute;