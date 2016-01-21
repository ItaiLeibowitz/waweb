import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		loading: function (transition, originRoute) {
			$('.loader').removeClass('hidden');
		},
		stopLoading: function (transition, originRoute) {
			$('.loader').addClass('hidden');
		},
		goBackward: function(){
			window.history.go(-1);
		},
		triggerTransition: function(destination, payload) {
			this.transitionTo(destination, payload);
		}
	}

});