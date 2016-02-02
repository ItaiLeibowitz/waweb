import Ember from 'ember';

export default Ember.Service.extend({
	length: 3,
	init: function(){
		this._super();
		this.set('model', Ember.A([]));
		this.get('uniqueItems');
	},

	modelDidChange: function() {
		Ember.run.scheduleOnce('sync', this, 'updateUniqueItems');
	}.observes('model.[]').on('init'),

	uniqueItemsDidChange: function(){
		if (this.get('uniqueItems').length > this.get('length')) {
			Ember.run.scheduleOnce('sync', this, 'cullOlderItems');
		}
	}.observes('uniqueItems.[]'),

	updateUniqueItems:function(){
		this.set('uniqueItems', this.get('model').uniq());
	},

	cullOlderItems: function() {
		var uniqueItems = this.get('uniqueItems');
		this.set('model', uniqueItems.slice(0, this.get('length')));
		console.log('culling length', this.get('model').map(function(item){return item.get('name')}))
	}
});