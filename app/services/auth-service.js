import Ember from 'ember';
import promiseFromAjax from 'waweb/mixins/promise_from_ajax';

export default Ember.Service.extend({
	userService: Ember.inject.service('user-service'),
	feedbackService: Ember.inject.service('feedback-service'),
	routing: Ember.inject.service('-routing'),
	name: null,
	email: null,
	password: null,
	currentForm: null,

	authenticate: function(ajaxOptions, skipValidation) {
		var self = this;
		var url = ajaxOptions.url;
		var router = self.get('target.router');
		var currentPath = self.get('controllers.application.currentPath');
		var isValid = (skipValidation || self.get('currentForm.isValid'));

		if (isValid) {
			promiseFromAjax(ajaxOptions)
				.then(function(user) {
					self.get('userService').login(user);
					ga('send', 'event', 'session', 'sign in / out', url);

					// if there was a transition to retry to an authenticated route, retry it now:
					var transitionToRetry = self.get('transitionToRetry')
					if (transitionToRetry) {
						transitionToRetry.retry();
					} else {
						window.history.go(-1);
					}
					self.get('feedbackService').setProperties({
						isShowing: true,
						feedbackSentence: "Hi, " + self.get('userService.user.name').split(" ")[0] + "!",
						feedbackLinkRoute: null,
						feedbackLinkTarget: null,
						feedbackLinkModel: null,
						feedbackActionName: null,
						feedbackAddedClass: 'success',
						feedbackDuration: 3000,
						persistAfterUrlChange: true
					});
					Ember.run.later(self, 'reset', 3000);
				}, function(jqXHR) {
					self.set('currentForm.validationFailed', true);

					if (jqXHR.status === 401) { // raised on signin
						self.set('serverErrors', ["Wrong email or password"]);
					} else if (jqXHR.status === 409) { // raised on signup
						self.set('serverErrors', ["Email has already been taken"]);
					} else {
						self.set('serverErrors', ["Something went wrong while signing in. Please try again later."]);
					}

					ga('send', 'event', 'session', 'sign in failed', url);
				});
		} else {
			self.set('currentForm.validationFailed', true);
		}
	},

	signinUser: function () {
		this.authenticate({
			url: '/api/ember2/users/signin',
			type: 'POST',
			data: { user: { email: this.get('email'), password: this.get('password') }}
		});
	},

	signupUser: function () {
		this.authenticate({
			url: '/api/ember2/users/signup',
			type: 'POST',
			data: { user: { name: this.get('name'), email: this.get('email'), password: this.get('password') }}
		});
	},

	signinWithFacebook: function () {
		var self = this;
		FB.login(function (response) { // Start login popup
			if (response.authResponse) { // User is connected to Facebook
				self.authenticate({
					url: '/api/ember2/users/signin_with_provider',
					type: 'POST',
					data: { provider: 'facebook', access_token: response.authResponse.accessToken }
				}, true);
			}
		}, { scope: 'email' }); // These are the permissions you are requesting
	},

	forgottenPassword: function () {
		var self = this;

		if (self.get('currentForm.isValid')) {
			promiseFromAjax({
				url: '/api/ember2/users/forgotten_password',
				type: 'POST',
				data: { email: self.get('email') },
				dataType: 'html'
			}).then(function () {
				self.reset(); // reset values
				self.get('feedbackService').setProperties({
					isShowing: true,
					feedbackSentence: "Just sent you an email with password reset instructions.",
					feedbackLinkRoute: null,
					feedbackLinkTarget: null,
					feedbackLinkModel: null,
					feedbackActionName: null,
					feedbackAddedClass: 'success',
					feedbackDuration: 3000,
					persistAfterUrlChange: true
				});
				self.get('routing.router').replaceWith('signin');
			}, function (jqXHR) {
				self.get('feedbackService').setProperties({
					isShowing: true,
					feedbackSentence: "Something went wrong with your password reset request. Please try again later..",
					feedbackLinkRoute: null,
					feedbackLinkTarget: null,
					feedbackLinkModel: null,
					feedbackActionName: null,
					feedbackAddedClass: 'failure',
					feedbackDuration: 3000,
					persistAfterUrlChange: true
				});
			});
		} else {
			self.set('validationFailed', true);
		}
	},

	resetPassword: function () {
		var self = this;
		var authController = this.get('controllers.authentication');

		if (self.get('isValid')) {
			promiseFromAjax({
				url: '/api/ember2/users/reset_password',
				type: 'PATCH',
				data: { user: { password_reset_token: self.get('reset_token'), password: self.get('password') } }
			}).then(function () {
				self.send('closeTopModal');
				Ember.run.later(function () {
					self.send('reset'); // reset server errors and validationFailed flag
					authController.send('reset'); // reset values
					self.send('displayFeedback', 'success', 'resetPassword', 1);
				}, 300);
			}, function (jqXHR) {
				if (jqXHR.status == 200) {
					self.send('closeTopModal');
					Ember.run.later(function () {
						self.send('reset'); // reset server errors and validationFailed flag
						authController.send('reset'); // reset values
						self.send('displayFeedback', 'success', 'resetPassword', 1);
					}, 300);
				} else {
					self.send('closeTopModal');
					if (jqXHR.status == 401) {
						self.send('displayFeedback', 'error', 'resetPassword', 2);
					} else {
						self.send('displayFeedback', 'error', 'resetPassword', 3);
					}
				}
			});
		} else {
			self.set('validationFailed', true);
		}
	},

	reset: function () {
		this.setProperties({
			name: null,
			password: null,
			email: null,
			serverErrors: null,
			validationFailed: false,
			transitionToRetry: null
		});
	}

});