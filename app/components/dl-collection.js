import Ember from 'ember';
import promiseFromUrl from 'waweb/mixins/promise_utils';

export default Ember.Component.extend({
	currentCollection: Ember.inject.service('current-collection'),
	isReady: false,
	downloadUrl: null,
	sequenceDelay: 5, // in seconds
	ultimateDelay: 180, // in seconds
	progress: 0, // in percent
	failed: false,
	nextCheck: null,

	progressStyle: function(){
		return `width: ${this.get('progress')}%`;
	}.property('progress'),

	checkProgress: function(){
		var url = '/api/ember2/collections/' + this.get('collection.id') + '/pdf',
			self = this;
		promiseFromUrl(url)
			.then(function(data){
				if (data.ready) {
					self.setProperties({
						downloadUrl: data.url,
						isReady: true
					});
					ga('send', 'event', 'dlCollection', 'ready');
				} else {
					var ultimateDelay = self.get('ultimateDelay'),
						sequenceDelay = self.get('sequenceDelay'),
						progress = self.get('progress');
					var newProgress = Math.round(progress + (sequenceDelay / ultimateDelay) * 100);
					if (newProgress < 100) {
						var nextCheck = Ember.run.later(self, 'checkProgress', self.get('sequenceDelay') * 1000);
						self.setProperties({
							failed: false,
							nextCheck: nextCheck,
							progress: newProgress
						});
					} else {
						self.fail();
						ga('send', 'event', 'dlCollection', 'fail','timeout');
					}
				}
			},function(){
				self.fail();
				ga('send', 'event', 'dlCollection', 'fail','other');
			}
		)
	},

	fail: function(){
		var nextCheck = this.get('nextCheck');
		if (nextCheck) Ember.run.cancel(nextCheck);
		this.setProperties({
			failed: true,
			progress: 0,
			downloadUrl: null,
			isReady: false
		})
	},


	actions:{
		downloadPdf: function(){
			if (!this.get('nextCheck')) {
				this.set('failed', false);
				this.checkProgress();
				ga('send', 'event', 'dlCollection', 'toggleExpand');
			}
		},
		retry: function() {
			if (this.get('nextCheck')) Ember.run.cancel(this.get('nextCheck'));
			this.set('failed', false);
			this.checkProgress();
			ga('send', 'event', 'dlCollection', 'retry');
		}
	}
});