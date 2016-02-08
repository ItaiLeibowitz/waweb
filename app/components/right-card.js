import Ember from 'ember';
import promiseFromUrl from 'waweb/mixins/promise_utils';


export default Ember.Component.extend({
	currentItem:Ember.inject.service('current-item'),
	mapService: Ember.inject.service('map-service'),
	mainImage: Ember.inject.service('main-image'),
	currentCollection: Ember.inject.service('current-collection'),
	stopScrollService: Ember.inject.service('stop-scroll'),
	recentItems: Ember.inject.service('recent-items'),
	model: Ember.computed.alias('currentItem.item'),
	withMap: Ember.computed.alias('currentItem.withMap'),
	withPhoto: Ember.computed.alias('currentItem.withPhoto'),
	currentListCard:  Ember.computed.alias('currentItem.currentListCard'),
	isOpen:  Ember.computed.alias('currentItem.isOpen'),
	isAd:  Ember.computed.alias('currentItem.isAd'),
	classNames: ['right-card'],
	classNameBindings: ['isOpen', 'isSaved', 'isAd', 'withMap', 'withPhoto'],
	isSaved: function(){
		return this.get('currentCollection.itemIds').indexOf(this.get('model.id')) > -1;
	}.property('currentCollection.itemIds.[]','model.id'),
	isSaving: null,

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
		mapService.set('centerMarkerModel', this.get('model'));
	},


	loadReviews: function(){
		var self = this,
			itemId = this.get('model.id');
		promiseFromUrl(`/api/ember/items/${itemId}/reviews`)
		.then(function(reviews){
			if (reviews.length > 0) {
				reviews.forEach(function(review, index){
					review.index = index;
				});
			}
			self.set('reviews', reviews);
			self.set('reviewsItem', itemId);
		})
	},

	reviewsItem:null,


	isOpenDidChange: function(){
		// check here if we attach map or photo
		if (this.get('isOpen')) {
			if (this.get('withMap')) {this.attachMap();}
			this.set('stopScrollService.stopCardOpen', true);
			this.get('recentItems.model').unshiftObject(this.get('model'))
			$('.info-container').scrollTop(0);
		} else {
			if (this.get('currentListCard')) {this.set('currentListCard.withInfo', false);}
			this.set('stopScrollService.stopCardOpen', false);
		}
	}.observes('isOpen'),

	swipeLeft: function () {
		this.set('isOpen', false);
		this.set('stopScrollService.stopMenuOpen', false);
	},

	actions:{
		toggleOpen: function(){
			this.toggleProperty('isOpen');
			if (!this.get('isOpen')){
				this.setProperties({
					withReviews: false
				});
			}
		},
		toggleSaved: function(){
			if (!this.get('isSaving')){
				this.set('isSaving', true);
				var self = this;
				if (this.get('isSaved')) {
					var p = this.get('currentCollection.currentEditable').removeItem(this.get('model'));
				} else {
					var p = this.get('currentCollection.currentEditable').addItem(this.get('model'));
				}
				p.finally(function(){
					self.set('isSaving', false);
				})
			}
		},
		toggleReviews: function(){
			this.toggleProperty('withReviews');
			if (this.get('withReviews') && (!this.get('reviews') || this.get('reviewsItem') != this.get('model.id'))){
				this.loadReviews();
			}
		},
		expandImage: function(){
			this.get('mainImage').setProperties({
				imageStyle: this.get('model.largeImageStyle'),
				imageUrl: this.get('model.largeImageUrl'),
				captionName: this.get('model.captionName'),
				captionLink: this.get('model.captionLink'),
				captionCc: this.get('model.captionCc'),
				isExpanded: true
			})
		}
	}
});