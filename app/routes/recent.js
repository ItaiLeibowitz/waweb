import Ember from "ember";
import Constants from 'waweb/appconfig/constants';
import RouteWithMap from "waweb/mixins/route-with-map";

export default Ember.Route.extend(RouteWithMap, {
	recentItems: Ember.inject.service('recent-items'),
	model: function(){
		return this.get('recentItems.uniqueItems') || Ember.A([])
	},
	setupController: function(controller, model){
		this._super(controller, model);
		//Setup map items
		var map = this.get('mapService');
		map.set('markerItems', model);
		// setup background images
		var photosArr = model.map(function(item){ return {image:item.get('largeImageStyle'), id:item.get('id')}});
		var n = photosArr.length;
		var mainItem = Ember.Object.create({
			name: "Recently viewed places"
		});
		controller.set('mainItem', mainItem);
		controller.set('photoArray', photosArr);
	},
	renderTemplate: function(controller, model){
		this._super(controller, model);
		$(document).scrollTop(0);
	}

});