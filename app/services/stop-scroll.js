import Ember from 'ember';

export default Ember.Service.extend({
	stopCardOpen: false,
	stopMenuOpen: false,

	stopAnyReason: Ember.computed.or('stopCardOpen','stopMenuOpen'),


	stopScrollDidChange: function(){
		Ember.run.scheduleOnce('afterRender', this, 'updateStopScroll');
	}.observes('stopAnyReason').on('init'),

	updateStopScroll: function(){
		if (this.get('stopAnyReason')) {
			$('body').addClass('no-scroll');
		} else {
			$('body').removeClass('no-scroll');
		}
	},

	enableScroll: function(){
		this.setProperties({
			stopCardOpen: false,
			stopMenuOpen: false
		})
	}

});