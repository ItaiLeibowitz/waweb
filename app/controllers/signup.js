import Ember from 'ember';
import EmberValidations from 'ember-validations';
import AuthenticationController from 'waweb/mixins/authentication-controller';

export default Ember.Controller.extend(EmberValidations, AuthenticationController, {
	hasFacebookSignin: true,
	hasName: true,
	hasEmail: true,
	hasPassword: true,
	title: 'Sign Up',
	otherLinks: [
		{ info: 'Already have a Wanderant account?', text: 'Sign In', state: 'signin' },
		{ info: '', text: 'Forgotten password?', state: 'forgotten-password' }
	],
	submitButtonText: 'Sign Up',

	validations: {
		name: {
			presence: true,
			length: { maximum: 50 }
		},
		email: {
			presence: true,
			format: { with: /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/ }
		},
		password: {
			length: { minimum: 6 }
		}
	},

	actions: {
		submit: function(){
			this.get('authService').signupUser();
		}
	}
});