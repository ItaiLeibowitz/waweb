import Ember from 'ember';
import promiseFromUrl from 'waweb/mixins/promise_utils';

export default Ember.Component.extend({
	mapService: Ember.inject.service('map-service'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	currentCollection: Ember.inject.service('current-collection'),
	classNames: ['photo-card'],
	classNameBindings: ['withInfo', 'isSaved', 'addedClass','isAd', 'topCard', 'resultCard', 'isExpanded', 'cardId'],
	withInfo: false,
	isExpanded: false,
	withReviews: false,
	reviews: null,
	addedClass: null,
	isSaved: function(){
		return this.get('currentCollection.itemIds').indexOf(this.get('model.id')) > -1;
	}.property('currentCollection.itemIds.[]','model.id'),
	isSaving: null,
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
		var photoArray = this.get('photoArray'),
			length = photoArray.length;
		photoArray.shuffle();
		var nextRotation = Ember.run.later(this, 'scheduleNextRotation', photoArray, 1, 5000)
		this.set('nextRotation', nextRotation);
	},

	scheduleNextRotation: function(photoArray, index){
		var realIndex = index % photoArray.length;
		var photo = photoArray[realIndex];
		this.rotatePhotos();
		Ember.run.later(this, 'loadNextPhoto', photo, 3000);
		var nextRotation = Ember.run.later(this, 'scheduleNextRotation', photoArray, realIndex + 1, 7000)
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
		if (this.get('photoArray')){
			this.set('photoStyle2', this.get('photoArray')[0]["image"]);
		}
		if (this.get('nextRotation')) {
			Ember.run.cancel(this.get('nextRotation'));
		}
		this.startPhotoRotation();
	},

	photoArrayDidChange: function(){
		this.resetPhotoRotation();
	}.observes('photoArray'),

	didInsertElement: function(){
		if (this.get('withImageRotation')) {
			this.startPhotoRotation();
		}
	},

	resetAction: function(){},

	willDestroyElement: function () {
		if (this.get('withInfo')){
			this.set('stopScrollService.stopComponent.stopCardOpen', false);
		}
		if (this.get('nextRotation')) {
			Ember.run.cancel(this.get('nextRotation'));
		}
		this._super();
	},

	boundsForMap: function(){
		return {
			swLat: this.get('model.boundSwLat') || this.get('model.latitude') - 0.1,
			swLng: this.get('model.boundSwLng') || this.get('model.longitude') - 0.1,
			neLat: this.get('model.boundNeLat') || this.get('model.latitude') + 0.1,
			neLng: this.get('model.boundNeLng') || this.get('model.longitude') + 0.1
		}
	}.property('model.boundSwLat','model.boundSwLng','model.boundNeLat', 'model.boundNeLng', 'model.latitude', 'model.longitude'),

	attachMap: function(){
		var container = this.$('.map-holder')[0],
			mapService = this.get('mapService');
		mapService.moveDomToElement(container);
		mapService.changeCenter(this.get('model.latitude'), this.get('model.longitude'));
		mapService.setProperties({
			draggable: false,
			disableDefaultUI: true,
			bounds: this.get('boundsForMap')
		});
		mapService.get('centerMarker').setProperties({
			lat: this.get('model.latitude'),
			lng: this.get('model.longitude')
		});
	},

	loadReviews: function(){
		var self = this;
		promiseFromUrl(`/api/ember/items/${this.get('model.id')}/reviews`)
			.then(function(reviews){
				if (reviews.length > 0) {
					reviews.forEach(function(review, index){
						review.index = index;
					});
				}
				self.set('reviews', reviews);
			})
	},

	swipeRight: function(){
		if (this.get('topCard')) {return;}
		if (this.get('withInfo')) {
			this.send('toggleInfo');
			return false;
		}
	},
	swipeLeft: function(){
		if (this.get('topCard') || !this.get('isExpanded')) {return;}
		if (!this.get('withInfo')) {
			this.send('toggleInfo');
			return false;
		}
	},
	tap: function(e){
		if ($(e.target).is('a')) {return false;}
		if (!$(e.target).is('a') && this.get('topCard')){
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
		if (!($(e.target).parents('.info-box').length > 0) && !this.get('withInfo') &&!this.get('topCard') && !this.get('preventSizeChange')){
			var currentState = this.get('isExpanded');
			if (this.get('resetSizeAction')) this.get('resetSizeAction')();
			this.set('isExpanded', !currentState);
			if (this.get('isExpanded')) {
				var self = this;
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
		toggleInfo: function(){
			var currentState = this.get('withInfo');
			if (this.get('resetInfoAction')) this.get('resetInfoAction')();
			this.set('withInfo', !currentState);
			if (this.get('withInfo')) {
				this.attachMap();
				this.set('stopScrollService.stopComponent.stopCardOpen', true);
			} else {
				this.set('stopScrollService.stopComponent.stopCardOpen', false);
			}
		},
		toggleSaved: function(){
			if (!this.get('isSaving')){
				this.set('isSaving', true);
				if (this.get('isSaved')) {
					this.get('currentCollection.currentEditable.items').removeObject(this.get('model'));
				} else {
					this.get('currentCollection.currentEditable.items').addObject(this.get('model'));
				}
				//TODO: fix this to happen in the promise
				this.set('isSaving', false);
			}
		},
		toggleReviews: function(){
			this.toggleProperty('withReviews');
			if (this.get('withReviews') && !this.get('reviews')){
				this.loadReviews();
			}
		}
	}
});