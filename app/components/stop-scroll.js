import Ember from 'ember';

export default Ember.Component.extend({
	stopScrollService: Ember.inject.service('stop-scroll'),
	stopCardOpen: false,
	stopMenuOpen: false,

	stopAnyReason: Ember.computed.or('stopCardOpen','stopMenuOpen'),

	init: function(){
		this._super();
		this.set('stopScrollService.stopComponent', this);
	},

	stopScrollDidChange: function(){
		Ember.run.scheduleOnce('afterRender', this, 'updateStopScroll');
	}.observes('stopAnyReason').on('init'),

	updateStopScroll: function(){
		if (this.get('stopAnyReason')) {
			$('body').addClass('no-scroll');
		} else {
			$('body').removeClass('no-scroll');
		}
	}



});