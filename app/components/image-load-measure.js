import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['image-load-measure'],
	didInsertElement: function () {
		this._super();
		var self= this;
		this.$('img').load(function(){
			if (!self.get('isDestroyed')) {
				self.set('parentView.imageDidLoad', true);
			}
		})
	},



});