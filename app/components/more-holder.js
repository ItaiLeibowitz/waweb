import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['more-holder'],
	classNameBindings: ['isExpanded','isShowing'],
	isExpanded: false,
	isShowing: false,
	threshold: 199,

	didInsertElement: function(){
		this.setup();
	},


	setup: function(){
		var self = this;
		$(window).off('scroll.moreHolder').on('scroll.moreHolder', function(){
			Ember.run.debounce(self, 'showMoreHolder',0, 100);
		})
	},
	unsetup: function(){
		$(window).off('.moreHolder');
	},

	willDestroyElement: function(){
		this.unsetup();
	},

	showMoreHolder: function(){
		if (this.$('.position-marker').offset().top <= $(window).scrollTop() + $(window).innerHeight() + this.get('threshold')) {
			this.set('isShowing', true);
		} else{
			this.set('isShowing', false);
		}
	},

	actions:{
		toggleExpanded: function(){
			this.toggleProperty('isExpanded');
		}
	}


});