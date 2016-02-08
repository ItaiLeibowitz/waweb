import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['validate-field'],
	classNameBindings: ['valid', 'invalid'],
	noErrors: Ember.computed.empty('errors'),
	hasErrors: Ember.computed.not('noErrors'),
	valid: Ember.computed.and('noErrors', 'lostFocus'),
	invalid: Ember.computed.and('hasErrors', 'lostFocus'),

	isFocused: false,
	hasBeenFocused: Ember.computed.notEmpty('value'), // set hasBeenFocused based on whether the field has a value or not
	notFocused: Ember.computed.not('isFocused'),
	lostFocus: Ember.computed.and('hasBeenFocused', 'notFocused'),
	focusIn: function(event) {
		this.set('hasBeenFocused', true);
		this.set('isFocused', true);
	},
	focusOut: function(event) {
		var self = this;
		Ember.run.later(function() {
			if (!self.isDestroyed) self.set('isFocused', false);
		}, 100);
	},


	controllerValidationObserver: function() {
		this.set('hasBeenFocused', true);
	}.observes('controller.validationFailed')
});
