import Ember from 'ember';

export default Ember.Component.extend({

	didInsertElement: function(){
		this.setup();
	},


	setup: function(){
		var self = this;
		$(window).off('scroll.cardPosFix').on('scroll.cardPosFix', function(){
			Ember.run.debounce(self, 'fixPositions', 500);
		})
	},
	unsetup: function(){
		$(window).off('scroll.cardPosFix');
	},

	willDestroyElement: function(){
		this.unsetup();
	},

	fixPositions: function(){
		this.get('resetAction')();
		var self = this;
		var posElemArray = $('.card-position-marker'),
			positionArray = posElemArray.map(function(){ return $(this).offset().top;}),
			scrollTop = $(window).scrollTop(),
			distanceArray = positionArray.map(function(el){ return Math.abs(this - scrollTop)});

		var min = distanceArray[0];
		var minIndex = 0;

		for (var i = 1; i < distanceArray.length; i++) {
			if (distanceArray[i] < min) {
				minIndex = i;
				min = distanceArray[i];
			}
		}


		this.unsetup();
		$('body').animate({
			scrollTop: positionArray[minIndex]-1
		},{
			duration: 200,
			easing: 'easeOutQuart',
			complete: function() { self.setup();}
		});

	}
});