import Ember from 'ember';
import promiseFromUrl from 'waweb/mixins/promise_utils';

export default Ember.Service.extend({
	store: Ember.inject.service('store'),
	currentCollection: Ember.inject.service('current-collection'),
	authenticityToken: null,
	user: null,
	initialSigninCheckCompleted: false,

	signedIn: Ember.computed.notEmpty('user'),
	isGuest: Ember.computed.alias('user.guest'),
	notGuest: Ember.computed.not('isGuest'),
	isRegistered: Ember.computed.and('signedIn', 'notGuest'),

	// Load the current user if the cookies exist and is valid
	init: function() {
		this._super();
		this.getUser();
		// if we do not have CSRF token, then get it
		if (Ember.isEmpty(this.get('authenticityToken'))) {
			this.getTokens();
		}
	},

	getUser: function(){
		var self = this;
		promiseFromUrl('/api/ember2/users/get_current_user')
			.then(function(results) {
				self.login(results);
			}, function(jqXHR) {
				self.setProperties({ initialSigninCheckCompleted: true, user: null });
			});
	},

	getTokens: function(){
		var self = this;
		$.get('/tokens', function(results) {
			self.set('authenticityToken', results.token);
		});
	},


	// Authenticate the user. Once they are authenticated, set the access token to be submitted with all
	// future AJAX requests to the server.
	login: function (results) {
		var store = this.get('store');
		if (!results.status || results.status != 'not_logged_in') {
			var user = store.push(store.normalize('user', results.data));
			store.pushPayload({data: results.included});
			var userId = results.data.id;
			delete results["user"];
			this.getTokens();
			// hint: partial loading based on: http://watsonbox.github.io/blog/2014/06/13/lazy-and-partial-data-loading-with-ember-dot-js-and-rails/
			this.set('user', user);
			// TODO: this could be a good spot to set up the current trip and collection on their own service

			if (!this.get('currentCollection.currentViewed')){
				var self = this;
				console.log('trying to get collection record from login')
				store.findRecord('collection', results.data.attributes["current-collection-id"])
					.then(function(collection){
						self.set('currentCollection.currentViewed', collection);
					});
			}
			var retryAction = this.get('actionToRetry');
			if (retryAction) {
				retryAction.target.send(retryAction.action, retryAction.payload);
				this.set('actionToRetry', null);
			}
			ga('set', 'userId', userId);
/*			intercomSend('update', {
				name: user.get('name'),
				user_id: user.get('id')
			})*/
		} else {
			this.set('user', null);
		}

		this.set('initialSigninCheckCompleted', true);
	},

	// Log out the user
	reset: function() {

		// Clear all the cookies - the remember token can only be accessed by the server
		Cookies.remove('collection_token');
		Cookies.remove('trip_token');
		// reset the AuthManager object
		Ember.run.next(this, function(){
			this.set('currentCollection.currentEdited', null);
			this.set('user', null);
			ga('set', 'userId', 'null');
		});
		// Trigger a route change


	},

	authenticityTokenObserver: function() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-Token': this.get('authenticityToken')
			}
		});
	}.observes('authenticityToken')

});