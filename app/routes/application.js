import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		loading: function (transition, originRoute) {
			$('.loader').removeClass('hidden');
		},
		stopLoading: function (transition, originRoute) {
			$('.loader').addClass('hidden');
		},
		triggerTransition: function(destination, payload) {
			this.transitionTo(destination, payload);
		},
		goBackward: function(){
			window.history.go(-1);
		}
	}

});