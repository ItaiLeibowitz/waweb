import Ember from "ember";
import Constants from 'waweb/appconfig/constants';

export default Ember.Route.extend({

	model: function(){
		var countries = this.store.findAll('item', {reload: true}).then(function(items){
			return items.filter(function(item){
				return item.get('itemType') === Constants.ITEM_TYPES_BY_NAME["COUNTRY"];
			});
		});
		return countries;
	},
	setupController: function(controller, model){
		this._super(controller, model);
		var backgroundImage = "background-image: url('https://da37ts4zp7h49.cloudfront.net/videos/back/back%@.jpg')",
			arr = [];
		for (var i = 0; i < 32; i++) {
			arr[i] = i;
		}
		var photosArr = arr.map(function(el){return backgroundImage.replace('%@',el + 1)});
		var photosArr = model.map(function(item){ return item.get('largeImageStyle')});
		var n = photosArr.length;
		var mainItem = Ember.Object.create({
			name: "Wanderant",
			itemTypeName: "Great places to visit around the world",
			largeImageStyle: photosArr[Math.floor(Math.random()*n)]
		});
		controller.set('photoArray', photosArr);
		controller.set('mainItem', mainItem);
	},
	renderTemplate: function(controller, model){
		this._super(controller, model);
		$(document).scrollTop(0);
	}

});