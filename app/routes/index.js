import Ember from "ember";
import Constants from 'waweb/appconfig/constants';
import RouteWithMap from "waweb/mixins/route-with-map";

export default Ember.Route.extend(RouteWithMap, {
	setPageTitle: function() {
		this.set('pageTitle', 'Wanderant - great places to visit all over the world');
	},
	model: function(){
		var countries = this.store.findAll('item', {reload: true}).then(function(items){
			return items.filter(function(item){
				return item.get('itemType') === Constants.ITEM_TYPES_BY_NAME["COUNTRY"];
			});
		});
		return countries;
	},
	controllerName: 'itemsWithSorter',
	setupController: function(controller, model){
		this._super(controller, model);
		//Setup map items
		var map = this.get('mapService');
		map.set('markerItems', model);
		// setup background images
		var backgroundImage = "background-image: url('https://da37ts4zp7h49.cloudfront.net/videos/back/back%@.jpg')",
			arr = [];
		for (var i = 0; i < 32; i++) {
			arr[i] = i;
		}
		var photosArr = arr.map(function(el){return backgroundImage.replace('%@',el + 1)});
		var photosArr = model.map(function(item){ return {image:item.get('largeImageStyle'),imageSource: item.get('largeImageUrl'), id:item.get('id')}});
		var n = photosArr.length;
		var mainItem = Ember.Object.create({
			name: "Wanderant",
			itemTypeName: "Great places to visit around the world",
			largeImageStyle: photosArr[Math.floor(Math.random()*n)].image,
			largeImageUrl: photosArr[Math.floor(Math.random()*n)].imageSource
		});
		controller.setProperties({
			photoArray: photosArr,
			mainItem: mainItem,
			items: model,
			moreHolderLinks: [
				{target: "countries", name: "All countries"}
			]
		});
	},

});