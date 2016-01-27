import Ember from 'ember';

export default Ember.Component.extend({
	currentItem: Ember.inject.service('current-item'),
	classNames: ['photo-card'],
	classNameBindings: ['addedClass', 'withInfo', 'isAd', 'topCard', 'resultCard', 'isExpanded', 'cardId'],
	withInfo: false,
	isExpanded: false,
	withReviews: false,
	reviews: null,
	addedClass: null,

	screenHeight: 0,
	resultCard: Ember.computed.alias('model.resultCard'),
	photoStyle1: Ember.computed.oneWay('model.largeImageStyle'),
	photoStyle2: function(){
		if (this.get('photoArray')){
			return this.get('photoArray')[0]["image"];
		}
	}.property('photoArray'),
	photoId1: null,
	photoId2: null,
	firstPhotoOff: false,
	cardId: function(){
		return `card-id-${this.get('model.id')}`;
	}.property('model.id'),

	startPhotoRotation: function(){
		var photoArray = this.get('photoArray');
		photoArray.shuffle();
		var nextRotation = Ember.run.later(this, 'scheduleNextRotation', photoArray, 1, 5000);
		this.set('nextRotation', nextRotation);
	},

	scheduleNextRotation: function(photoArray, index){
		var realIndex = index % photoArray.length;
		var photo = photoArray[realIndex];
		this.rotatePhotos();
		var nextPhotoLoad = Ember.run.later(this, 'loadNextPhoto', photo, 3000);
		this.set('nextPhotoLoad', nextPhotoLoad);
		var nextRotation = Ember.run.later(this, 'scheduleNextRotation', photoArray, realIndex + 1, 7000);
		this.set('nextRotation', nextRotation);
	},

	rotatePhotos: function(){
		this.toggleProperty('firstPhotoOff');
	},

	loadNextPhoto: function(photo){
		if (this.get('firstPhotoOff')) {
			this.set('photoStyle1', photo.image);
			this.set('photoId1', photo.id);
		} else {
			this.set('photoStyle2', photo.image);
			this.set('photoId2', photo.id);
		}
	},

	resetPhotoRotation: function(){
		this.set('firstPhotoOff', false);
		this.set('photoStyle1', this.get('model.largeImageStyle'));
		if (this.get('photoArray')) {
			var photoArray = this.get('photoArray');
			if (photoArray[0]["image"].string != this.get('model.largeImageStyle').string || photoArray.length == 1) {
				this.set('photoStyle2', photoArray[0]["image"]);
			} else {
				this.set('photoStyle2', photoArray[1]["image"]);
			}
		}
		if (this.get('nextRotation')) {
			Ember.run.cancel(this.get('nextRotation'));
		}
		if (this.get('withImageRotation')) {
			this.startPhotoRotation();
		}
	},

	photoArrayDidChange: function(){
		if (this.get('withImageRotation')) {
			this.resetPhotoRotation();
		}
	}.observes('photoArray').on('init'),


	resetAction: function(){},

	willDestroyElement: function () {
		if (this.get('nextRotation')) {
			Ember.run.cancel(this.get('nextRotation'));
			Ember.run.cancel(this.get('nextPhotoLoad'));
		}
		this._super();
	},



	tap: function(e){
		if ($(e.target).is('a')) {return false;}
		if (!($(e.target).parents('.buttons').length > 0) && this.get('topCard')){
			var scrollTop =  $(window).height();
			if (this.get('withImageRotation')) {
				if (this.get('firstPhotoOff')){
					if (this.get('photoId2')){
						scrollTop = $(`.card-id-${this.get('photoId2')}`).offset().top;
					}
				} else {
					if (this.get('photoId1')){
						scrollTop = $(`.card-id-${this.get('photoId1')}`).offset().top;
					}
				}
			}

			$('body').animate({
				scrollTop: scrollTop
			},{
				duration: 1500,
				easing: 'easeOutQuart'
			});
		}
		if (!($(e.target).parents('.info-box').length > 0) && !this.get('topCard') && !this.get('preventSizeChange')){
			var currentState = this.get('isExpanded');
			if (this.get('resetSizeAction')) this.get('resetSizeAction')();
			this.set('isExpanded', !currentState);
			if (this.get('isExpanded')) {
				Ember.run.scheduleOnce('afterRender', this,'scrollToTop');
			}
		}
	},

	scheduleScrollToTop:function(){
		Ember.run.later( this,'scrollToTop',10);
	},

	scrollToTop: function(){
		var newPosition = this.$('.card-position-marker').offset().top;
		$('body').animate({
			scrollTop: newPosition
		},{
			duration: 200,
			easing: 'easeOutQuart'
		});
	},

	actions:{
		showInfo: function(){
			this.get('currentItem').setProperties({
				item: this.get('model'),
				withMap: true,
				withPhoto: false,
				isAd: this.get('isAd'),
				isOpen: true,
				currentListCard: this
			});
			Ember.run.scheduleOnce('render', this, 'scrollToTop');
			this.set('withInfo', true);
		}
	}
});