import Ember from 'ember';
import EmberValidations from 'ember-validations';
import AuthenticationController from 'waweb/mixins/authentication-controller';

export default Ember.Controller.extend(EmberValidations, AuthenticationController, {
	hasEmail: true,
	title: 'Forgotten password',
	otherLinks: [{ info: '', text: 'Back to signin', state: 'signin'}],
	submitButtonText: 'Request password reset',

	validations: {
		email: {
			presence: true,
			format: { with: /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/ }
		}
	},

	actions: {
		submit: function(){
			this.get('authService').forgottenPassword();
		}
	}
});