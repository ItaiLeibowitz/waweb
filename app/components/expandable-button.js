import Ember from 'ember';

export default Ember.Component.extend({
	classNames: 'floating-button',
	classNameBindings: ['isExpanded', 'addedClass'],
	isExpanded: false,
	addedClass: null,

	didInsertElement: function(){
		this.get('parentView').set('modalComponent', this);
		this._super();
	},

	actions: {
		toggleExpanded: function(){
			this.toggleProperty('isExpanded');
			if (this.get('isExpanded') && this.get('onExpand')){
				this.get('onExpand')();
			}
		}
	}
});