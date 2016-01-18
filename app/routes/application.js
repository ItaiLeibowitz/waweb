import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		goBackward: function(){
			window.history.go(-1);
		}
	}

});