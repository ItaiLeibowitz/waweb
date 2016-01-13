import Ember from 'ember';

export default Ember.Component.extend({
	screenHeight: 0,
	screenWidth: 0,

	didInsertElement: function(){
		Ember.run.schedule('afterRender',this, 'updateDims');
		var self = this;
		$(window).off('resize.windowService').on('resize.windowService', function(){
			Ember.run.schedule('afterRender', self, 'updateDims');
		});
	},

	updateDims: function(){
		this.set('screenHeight', $(window).height());
		this.set('screenWidth', $(window).width());
	}
});