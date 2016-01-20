import Ember from 'ember';

export default Ember.Service.extend({
	model: null,

	items: function(){
		if (this.get('model')){
			 return this.get('model.items');
		} else {
			return [];
		}
	}.property('model'),

	itemIds: function(){
		return this.get('items').map(function(item){
			return item.get('id');
		})
	}.property('items.[]')


});