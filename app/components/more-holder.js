import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['more-holder'],
	isCloseToBottom: false,
	screenDims: Ember.inject.service('screen-dims'),
	classNameBindings: ['isExpanded','isShowing'],
	isExpanded: false,
	baseThreshold: 199,
	threshold: function(){
		return Math.min(this.get('baseThreshold'), this.get('screenDims.component.screenHeight') / 4);
	}.property('baseThreshold', 'screenDims.component.screenHeight'),

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
		if (!this.get('isDestroyed')) {
			if (this.$('.position-marker').offset().top <= $(window).scrollTop() + $(window).innerHeight() + this.get('threshold')) {
				this.set('isShowing', true);
			} else {
				this.set('isShowing', false);
			}
			ga('send', 'event', 'moreHolder', 'showing', this.get('isShowing'));
		}
	},

	actions:{
		toggleExpanded: function(){
			this.toggleProperty('isExpanded');
			ga('send', 'event', 'moreHolder', 'toggleExpanded', this.get('isExpanded'));
		}
	}


});