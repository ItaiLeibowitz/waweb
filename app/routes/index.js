import Ember from "ember";
import Constants from 'waweb/appconfig/constants';

export default Ember.Route.extend({

	model: function(){
		var countries = this.store.findAll('item').then(function(items){
			return items.filter(function(item){
				return item.get('itemType') === Constants.ITEM_TYPES_BY_NAME["COUNTRY"];
			});
		});
		return countries;
	},
	renderTemplate: function(controller, model){
		this._super(controller, model);
		$(document).scrollTop(0);
	}

});