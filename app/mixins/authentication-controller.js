import Ember from 'ember';

export default Ember.Mixin.create({
	userService: Ember.inject.service('user-service'),
	authService: Ember.inject.service('auth-service'),
	name: Ember.computed.alias('authService.name'),
	email: Ember.computed.alias('authService.email'),
	password: Ember.computed.alias('authService.password'),

	setAsCurrentForm: function(){
		this.set('authService.currentForm', this);
	},

	actions:{
		signinWithFacebook: function(){
			this.get('authService').signinWithFacebook();
		}
	}
});

