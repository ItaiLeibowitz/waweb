import Ember from 'ember';

export default Ember.Service.extend({
	length: 10,
	init: function(){
		this._super();
		this.set('model', Ember.A([]));
		this.get('uniqueItems');
	},

	modelDidChange: function() {
		Ember.run.scheduleOnce('sync', this, 'updateUniqueItems');
	}.observes('model.[]').on('init'),

	updateUniqueItems:function(){
		var uniqueItems = this.get('model').uniq().compact().slice(0,this.get('length'));
		var oldCookieIds = Cookies.getJSON('recentItemIds'),
			newItemIds = uniqueItems.map(function(item){return item.get('id')}),
			newCookieIds = newItemIds.concat(oldCookieIds).uniq().compact().slice(0,this.get('length'));
		this.set('uniqueItems', uniqueItems);
		Cookies.set('recentItemIds', newCookieIds, { expires: 30 });
	}
});