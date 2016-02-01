import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
	menuService: Ember.inject.service('menu-service'),
	currentItem: Ember.inject.service('current-item'),
	feedbackService: Ember.inject.service('feedback-service'),
	mapService: Ember.inject.service('map-service'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	location: config.locationType,

	doSomethingOnUrlChange: function() {
		Ember.run.schedule('afterRender', this, 'prepView');
	}.on('didTransition'),

	// Close any menus, and send a message to applicationRouter to scroll to the appropriate tab
	prepView: function () {
		this.get('menuService').set('leftMenuOpen', false);
		this.set('currentItem.isOpen', false);
		this.set('feedbackService.isShowing', false);
		this.get('mapService').minimizeMap({closeAll: true});
		var stopComponent = this.get('stopScrollService.stopComponent');
		if (stopComponent) {
			stopComponent.enableScroll();
		}
		$('.ember-transitioning-in').removeClass('ember-transitioning-in');
		$('.loader').addClass('hidden');
	}
});

Router.map(function() {
	this.route('item', { resetNamespace: true, path: '/items/:item_slug' }, function () {
		this.route('highlights');
	});
	this.route('collection', { resetNamespace: true, path: '/collections/:collection_slug' }, function () {
	});
	this.route('user',{ resetNamespace: true, path: '/my/' }, function(){
		this.route('collections');
	});
	this.route('search');
});

export default Router;
