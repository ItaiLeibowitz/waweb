import Ember from 'ember';
import EmberValidations from 'ember-validations';
import AuthenticationController from 'waweb/mixins/authentication-controller';

export default Ember.Controller.extend(EmberValidations, AuthenticationController, {
	hasFacebookSignin: true,
	hasEmail: true,
	hasPassword: true,
	title: 'Sign In',
	otherLinks: [
		{ info: 'Don\'t have a Wanderant account?', text: 'Sign Up', state: 'signup' },
		{ info: '', text: 'Forgotten password?', state: 'forgotten-password' }
	],
	submitButtonText: 'Sign In',

	validations: {
		email: {
			presence: true,
			format: { with: /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/ }
		},
		password: {
			presence: true
		}
	},

	actions: {
		submit: function(){
			this.get('authService').signinUser();
		}
	}
});