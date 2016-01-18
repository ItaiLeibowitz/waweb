import Ember from 'ember';


export default Ember.Component.extend({
	wrappedField: null,

	actions: {
		clearSearch: function(){
			this.set('wrappedField.query', '');
		},
		foundItem: function(route, payload){
			this.sendAction('foundItem', route, payload)
		}
	}

});