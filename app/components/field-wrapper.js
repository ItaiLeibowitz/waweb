import Ember from 'ember';


export default Ember.Component.extend({
	classNames: ['field-wrapper'],
	value: null,
	placeholder: null,
	autoFocus: false,

	didInsertElement: function(){
		if (this.get('autoFocus')){
			this.$('input').focus();
		}
		this._super();
	},



	actions: {
		clearField: function () {
			this.set('value', null);
			this.$('input').focus();
		},
		submit: function (query) {
			this.get('targetObject').send('submit');
		}
	}

});