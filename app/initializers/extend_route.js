import Ember from 'ember';


export function initialize(application){

	Ember.Route.reopen({
		targetsWithScrollDelay: ['search'],

		actions: {
			willTransition: function(transition){
				// Chrome on iOS has a weird bug - it disables scrollTop and that interferes when moving from a scrolled page to, say, search - it disappears.
				// What this little hack does is it delays the transition by a bit in order to let the page scrolling happen first before chrome stops it.
				this._super(transition);
				$(document).scrollTop(0);
				if (this.get('targetsWithScrollDelay').indexOf(transition.targetName) > -1) {
					if (!this.get('allowDelayedTransition')) {
						var self = this;
						transition.abort();
						Ember.run.later(this, function () {
							self.set('allowDelayedTransition', true);
							transition.retry();
						}, 100)
					} else {
						this.set('allowDelayedTransition', null);
					}
				}
			}
		}
	})

};


export default {
	name: 'extend-route',
	initialize: initialize
};