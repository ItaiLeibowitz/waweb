import Ember from 'ember';

export default Ember.Component.extend({
	screenDimsService: Ember.inject.service('screen-dims'),
	screenHeight: 0,
	initialScreenHeight: 0,
	screenWidth: 0,

	didInsertElement: function(){
		this.set('screenDimsService.component', this);
		this.setup();
		Ember.run.schedule('afterRender',this, 'updateDims');
		var self = this;
		$(window).off('resize.windowService').on('resize.windowService', function(){
			Ember.run.schedule('render', self, 'updateDims');
		});
	},

	setup: function(){
		var self = this;

		$(window).off('scroll.screenDimFix').on('scroll.screenDimFix', function(){
			//self.set('parentView.isMinimized', true);
			Ember.run.debounce(self, 'updateDims',0, 200);
		})
	},
	unsetup: function(){
		$(window).off('.screenDimFix');
	},

	willDestroyElement: function(){
		this.unsetup();
	},



	updateDims: function(){
		this.set('screenHeight', window.innerHeight);
		this.set('screenWidth', window.innerHeight);
		if (Math.abs(this.get('initialScreenHeight')-this.get('screenHeight')) > 100) {
			this.set('initialScreenHeight', window.innerHeight);
		}
	}
});