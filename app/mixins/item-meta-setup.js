import Ember from 'ember';
import Utils from 'waweb/appconfig/utils';
import Constants from 'waweb/appconfig/constants';

export default Ember.Mixin.create({
	setPageTitle: function() {
		var model = this.modelFor('item');
		var maxPageLength = Constants.MAX_PAGE_TITLE_LENGTH;
		var mappings = Constants.PAGE_TITLE_MAPPINGS;
		var itemName = model.get('name');

		var pageTitle;

		if (mappings) {
			if (model.get('canHaveChildren')) {
				if (Utils.itemTypeIsCountry(model.get('itemType'))) {
					var itemType = "places to visit"
				} else {
					var itemType = "things to do"
				}
				var newMappings = mappings.map(function(mapping){
					return mapping.replace("\%s", itemType);
				});
				var filteredMappings = newMappings.filter(function(mapping) {
					return mapping.length + itemName.length <= maxPageLength;
				});
				pageTitle = itemName + "-" + (filteredMappings.get('firstObject') || newMappings.get('lastObject'));
			} else {
				var itemTypeInParent = model.get('itemTypeInParent');
				if (itemName.length + itemTypeInParent.length <= Constants.MAX_ITEM_WITH_TYPE_IN_PARENT_LENGTH) {
					pageTitle = itemName + ', ' + itemTypeInParent + ' | Wanderant';
				} else {
					pageTitle = itemName + ', ' + model.get('parentName') + ' | Wanderant';
				}
			}
		} else if (this.get('subRouteName')) {
			pageTitle = itemName + ' ' + this.get('subRouteName') + ' | Wanderant';
		} else {
			pageTitle = itemName + ' | Wanderant';
		}

		this.set('pageTitle', pageTitle);
	},
	setPageMetaDescription: function() {
		this.setPageMetaDescriptionFromModel(this.modelFor('item'));
	},
	setPageMetatags: function() {
		this.setPageMetatagsFromModel(this.modelFor('item'));
	}
});
