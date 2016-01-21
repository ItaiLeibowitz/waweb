import Ember from 'ember';

export default Ember.Component.extend({
	maxDelay: 3000,
	mouseIsDown: false,
	touchIsDown: false,
	isAutoScrolling: false,
	shouldFix: function(){
		return  ![this.get('mouseIsDown'), this.get('isAutoScrolling'), this.get('touchIsDown')].some(function(el){return el})
	}.property('mouseIsDown','isAutoScrolling', 'touchIsDown'),

	didInsertElement: function(){
		this.setup();
	},


	setup: function(){
		var self = this;
		$(window).off('mouseDown.cardPosFix').on('mouseDown.cardPosFix', function(){
			console.log('mouse down!')
			self.set('mouseIsDown', true);
		});
		$(window).off('mouseUp.cardPosFix').on('mouseUp.cardPosFix', function(){
			console.log('mouse up!')
			self.set('mouseIsDown', false);
		});
		$(window).off('touchstart.cardPosFix').on('touchstart.cardPosFix', function(){
			console.log('touch down!')
			self.set('touchIsDown', true);
		});
		$(window).off('touchend.cardPosFix').on('touchend.cardPosFix', function(){
			console.log('touch up!')
			self.set('touchIsDown', false);
		});

		$(window).off('scroll.cardPosFix').on('scroll.cardPosFix', function(){
			//self.set('parentView.isMinimized', true);
			Ember.run.debounce(self, 'fixPositionsCondition',0, 100);
		})
	},
	unsetup: function(){
		$(window).off('.cardPosFix');
	},

	willDestroyElement: function(){
		this.unsetup();
	},

	fixPositionsCondition: function(delay){
		if (delay >= this.get('maxDelay')) {return;}
		if (this.get('shouldFix')){
			this.fixPositions();
		} else {
			Ember.run.debounce(this, 'fixPositionsCondition', (delay + 100), 100);
		}
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


		this.set('isAutoScrolling', true);
		$('body').animate({
			scrollTop: positionArray[minIndex]-1
		},{
			duration: 200,
			easing: 'easeOutQuart',
			complete: function() {
				self.set('isAutoScrolling', false);
			}
		});

	}
});