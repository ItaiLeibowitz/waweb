import Ember from 'ember';

export default Ember.Mixin.create({
	sortOptions: null,
	sortOrder: '',
	sortedItems: null,


	sortOrderDidChange: function(){
		Ember.run.scheduleOnce('actions', this, 'reSortItems')
	}.observes('sortOrder').on('init'),


	itemsDidChange: function(){
		 Ember.run.scheduleOnce('actions', this, 'reSortItems')
	}.observes('items.[]'),

	reSortItems: function(){
		var sortOrder = this.get('sortOrder');
		if (sortOrder) {
			if (this.get('items') && this.get('items.length') > 0) {
				var sorted = this.get('items').sortByExtended(sortOrder);
				this.set('sortedItems', sorted);
			} else {
				this.set('sortedItems', Ember.ArrayProxy.create({content: []}));
			}
		} else {
			this.set('sortedItems', this.get('items'));
		}
	}

});

