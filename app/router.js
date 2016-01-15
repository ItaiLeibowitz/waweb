import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    menuService: Ember.inject.service('menu-service'),
	location: config.locationType,

	doSomethingOnUrlChange: function() {
		Ember.run.schedule('afterRender', this, 'prepView');
	}.on('didTransition'),

	// Close any menus, and send a message to applicationRouter to scroll to the appropriate tab
	prepView: function () {
		this.get('menuService').set('leftMenuOpen', false);
	}
});

Router.map(function() {
	this.route('item', { resetNamespace: true, path: '/items/:item_slug' }, function () {
		this.route('highlights');
	});
});

export default Router;
