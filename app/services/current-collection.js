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

	_reloadCurrentEditable: function(){
		console.log('would have reloading collection here')
		//var collection = this.get('store').findRecord('collection', this.get('currentEditable.id'), {reload: true})
	},

	items: function () {
		if (this.get('currentEditable')) {
			if (this.get('currentEditable.partial')) {
				// trigger one reload of the currentCollection
				Ember.run.scheduleOnce('sync', this, '_reloadCurrentEditable');
			} else if (this.get('currentEditable.items.length') > 0) {
				return this.get('currentEditable.items');
			}
		}
		return [];

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