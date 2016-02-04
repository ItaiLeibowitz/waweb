import Ember from "ember";
import promiseFromUrl from 'waweb/mixins/promise_utils';


export default Ember.Route.extend({
	model: function() {
		var url = '/api/ember2/collections/featured',
			store = this.get('store');
		return promiseFromUrl(url).then(function(data){
			var collections = new Array(data.data.length);

			for (var i = 0; i < data.data.length; i++) {
				var collection = store.push(store.normalize('collection', data.data[i]));
				collections[i] = collection;
			}

			if (data.included && data.included.length > 0) {store.pushPayload({data: data.included});}
			return collections;
		});
	},
});


