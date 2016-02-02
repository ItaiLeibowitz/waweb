import Ember from 'ember';
import promiseFromAjax from 'waweb/mixins/promise_from_ajax';

export default Ember.Component.extend({
	store: Ember.inject.service('store'),
	feedbackService: Ember.inject.service('feedback-service'),
	currentCollection: Ember.inject.service('current-collection'),
	userService: Ember.inject.service('user-service'),
	collectionName: "My new collection",
	isSubmitting: false,
	modalComponent: null,

	actions:{
		clearName: function(){
			this.set('collectionName', null);
		},
		submit: function(){
			if (!this.get('isSubmitting')) {
				this.set('isSubmitting', true);

				var self = this;
				promiseFromAjax({
					url: '/api/ember2/collections/',
					type: 'POST',
					data: { collection: { name: this.get('collectionName') || "New collection" }}
				}).then(function (data) {
					var store = self.get('store');
					var collection = store.push(store.normalize('collection',data.data));
					self.get('feedbackService').setProperties({
						isShowing: true,
						feedbackSentence: "Success! You can now save places to the collection:",
						feedbackLinkRoute: 'collection',
						feedbackLinkTarget: collection.get('slug'),
						feedbackLinkModel: collection,
						feedbackActionName: null,
						feedbackAddedClass: 'success'
					});
					self.get('currentCollection').set('currentViewed', collection);
					self.set('modalComponent.isExpanded', false);
					self.get('userService.user.collections').unshiftObject(collection);
					self.get('targetObject.model').unshiftObject(collection);
					self.set('isSubmitting', false)
				}, function (jqXHR) {
					self.get('feedbackService').setProperties({
						isShowing: true,
						feedbackSentence: "Oops... couldn't create your collection. Try again in a bit",
						feedbackLinkRoute: null,
						feedbackLinkTarget: null,
						feedbackLinkModel: null,
						feedbackActionName: null,
						feedbackAddedClass: 'failure'
					});
					self.set('isSubmitting', false)
				});
			}
		}
	}
});