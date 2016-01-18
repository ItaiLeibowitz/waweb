import Ember from 'ember';


export default Ember.Component.extend({
	wrappedField: null,

	actions: {
		clearSearch: function(){
			this.set('wrappedField.query', '');
		}
	}

});