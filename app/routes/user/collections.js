import Ember from "ember";
import promiseFromUrl from 'waweb/mixins/promise_utils';


export default Ember.Route.extend({
	model: function() {
		var url = '/api/ember2/users/get_current_user_collections',
			store = this.get('store');
		return promiseFromUrl(url).then(function(data){
			var collections = new Array(data.data.length);

			for (var i = 0; i < data.data.length; i++) {
				var collection = store.push(store.normalize('collection', data.data[i]));
				collections[i] = collection;
			}

			if (data.included) {store.pushPayload({data: data.included});}
			return collections;
		});
	},
	renderTemplate: function(controller, model){
		this._super(controller, model);
		$(document).scrollTop(0);
	}
});


