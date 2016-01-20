import Ember from 'ember';
import promiseFromUrl from 'waweb/mixins/promise_utils';

export default Ember.Service.extend({
	store: Ember.inject.service('store'),
	currentUser: Ember.inject.service('user-service'),
	currentEditable: null,
	currentViewed: null,


	setupCurrentEditable: function(){
		if (this.get('currentViewed.ownerId') === this.get('currentUser.user.id')) {
			this.set('currentEditable', this.get('currentViewed'));
		}
	}.observes('currentViewed','currentUser.user').on('init'),

	items: function () {
		if (this.get('currentEditable')) {
			if (this.get('currentEditable.partial')) {
				return this.get('store').findRecord('collection', this.get('currentEditable.id'), {reload: true})
					.then(function (collection) {
						return collection.get('items')
					})
			} else {
			  return this.get('currentEditable.items');
			}
		} else {
			return [];
		}
	}.property('currentEditable','currentEditable.partial', 'currentEditable.items.[]'),

	itemIds: function(){
		if (this.get('items') && this.get('items.length')) {
			return this.get('items').map(function(item){
				return item.get('id');
			})
		} else {
			return [];
		}
	}.property('items','items.[]')


});