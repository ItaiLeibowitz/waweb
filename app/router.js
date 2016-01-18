import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    menuService: Ember.inject.service('menu-service'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	location: config.locationType,

	doSomethingOnUrlChange: function() {
		Ember.run.schedule('afterRender', this, 'prepView');
	}.on('didTransition'),

	// Close any menus, and send a message to applicationRouter to scroll to the appropriate tab
	prepView: function () {
		this.get('menuService').set('leftMenuOpen', false);
		var stopComponent = this.get('stopScrollService.stopComponent');
		if (stopComponent) {
			stopComponent.enableScroll();
		}
	}
});

Router.map(function() {
	this.route('item', { resetNamespace: true, path: '/items/:item_slug' }, function () {
		this.route('highlights');
	});
	this.route('collection', { resetNamespace: true, path: '/collection/:collection_slug' }, function () {
	});
	this.route('search');
});

export default Router;
