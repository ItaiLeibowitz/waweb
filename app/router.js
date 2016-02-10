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
		ga('send', 'pageview',{
			'page': this.get('url'),
			'title': this.get('url')
		});
	}.on('didTransition'),

	// Close any menus, and send a message to applicationRouter to scroll to the appropriate tab
	prepView: function () {
		this.get('menuService').set('leftMenuOpen', false);
		this.set('currentItem.isOpen', false);
		if (!this.get('feedbackService.persistAfterUrlChange')) {this.set('feedbackService.isShowing', false);}
		this.get('mapService').minimizeMap({closeAll: true});
		this.get('stopScrollService').enableScroll();
		$('.loader').addClass('hidden');
	}
});

Router.map(function() {
	this.route('item', { resetNamespace: true, path: '/items/:item_slug' }, function () {
		this.route('highlights');
		this.route('destinations');
		this.route('attractions');
	});
	this.route('collection', { resetNamespace: true, path: '/collections/:collection_slug' }, function () {
	});
	this.route('user',{ resetNamespace: true, path: '/my/' }, function(){
		this.route('collections');
	});
	this.route('search');
	this.route('featured-collections');
	this.route('recent');
	this.route('signup');
	this.route('signin');
	this.route('forgotten-password');

});

export default Router;
