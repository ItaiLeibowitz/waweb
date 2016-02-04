import Ember from 'ember';


export function initialize(application){

	Ember.Route.reopen({
		/*init: function(){
			console.log('using custom route')
			this._super.apply(this, arguments);
		},*/

		renderTemplate: function(){
			this._super.apply(this,arguments);
			if (this.get('scrollViewToTop')) {
				Ember.run.later(this, '_scrollToTop', 4000)
			}
		},

		_scrollToTop: function(){
			window.scrollBy(0,-10000);
			console.log('scrolling to top')
			$('#back-indicator').click();
			$(document).scrollTop(0);
			$('.scroller').scrollTop(0);
			window.scrollTo(0,0)
			$("body").animate({
				scrollTop: 0,
				scrollLeft: 0
			}, 800, function(){
				$('html,body').clearQueue();
			});
			console.log($(document).scrollTop())
		}
	})

};


export default {
	name: 'extend-route',
	initialize: initialize
};