import Ember from "ember";
import Constants from 'waweb/appconfig/constants';
import RouteWithMap from "waweb/mixins/route-with-map";

export default Ember.Route.extend(RouteWithMap, {
	setPageTitle: function() {
		this.set('pageTitle', 'Wanderant - all country guides');
	},
	templateName: 'item.items',
	model: function(){
		var store = this.get('store'),
			self = this;
		return Ember.$.getJSON('/api/ember2/items/countries').then(function(data){
			var items = new Array(data.data.length);

			for (var i = 0; i < data.data.length; i++) {
				var item = store.push(store.normalize('item', data.data[i]));
				items[i] = item;
			}

			if (data.meta) {
				self.set('hasMore', data.meta.more);
			}
			return Ember.ArrayProxy.create({content: items});
		});
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
			itemTypeName: "Explore any of our country guides",
			largeImageStyle: photosArr[Math.floor(Math.random()*n)].image,
			largeImageUrl: photosArr[Math.floor(Math.random()*n)].imageSource
		});
		controller.set('items', model);
		controller.set('photoArray', photosArr);
		controller.set('mainItem', mainItem);
		controller.set('moreHolderLinks', [
			{target: "countries", name: "All countries"}
		]);
		controller.set('sortOptions',[
			{value: 'name', name: 'A - Z'},
			{value: '', name: 'Popularity'}
		])
	},
	renderTemplate: function(controller, model) {
		this._super(controller, model);
		this.render('countries-menu', {   // the template to render
			into: 'application',                // the template to render into
			outlet: 'page-specific',              // the name of the outlet in that template
			controller: controller        // the controller to use for the template
		});
	},
});