import Ember from 'ember';
import promiseFromUrl from 'waweb/mixins/promise_utils';

export default Ember.Service.extend({
	store: Ember.inject.service('store'),
	wanderantUrl: '/api/ember/items/text_search',

	queryParams: {
		orig: {
			refreshModel: true
		}
	},

	query: null,
	originalQuery: null,
	requestParams: null,
	modelForRouteResolver: null,
	wanderantItems: [],
	googleItems: [],

	_getGoogleItems: function(query) {
		var store = this.store;
		var adapter = this.googleItemAdapter;

		return adapter.googleTextQuery(query).then(function (data) {
			return adapter.combineWithWanderant(data, store);
		}, function (status) {
			console.log('google text query failed', status);
			return [];
		});
	},

	_loadWanderantItems: function(query) {
		var self = this;

		return Ember.RSVP.promiseFromUrl(this.get('wanderantUrl'), { query: query }).then(function(data) {
			var items = self.store.loadMany('item', { items: data.items });
			return items;
		}, function (jqXHR) {
			console.log('wanderant items failed', jqXHR);
			return [];
		});
	},


	searchRank: function(item, query, wanderantItems, googleItems) {
		var wanderantItemsLength = wanderantItems.get('length');
		var googleItemsLength = googleItems.get('length');

		var wanderantIndex = wanderantItems.indexOf(item);
		var googleIndex = googleItems.indexOf(item);

		var jaroWeight = 3;
		var wanderantWeight = 2;
		var googleWeight = 1;
		var imageWeight = 1;
		var onelinerWeight = 1;

		var jaroRank = item.get('name').distance(query);
		var wanderantRank = ((wanderantIndex > -1) ? (wanderantItemsLength - wanderantIndex) / wanderantItemsLength : 0);
		var googleRank = ((googleIndex > -1) ? (googleItemsLength - googleIndex) / googleItemsLength : 0);
		var imageRank = (item.get('imageBaseUrl') ? 1 : 0);
		var onelinerRank = (item.get('oneliner') ? 1 : 0);

		var searchRank = ((jaroWeight * jaroRank) + (wanderantWeight * wanderantRank) + (googleWeight * googleRank) + (imageWeight * imageRank) + (onelinerWeight * onelinerRank));
		return searchRank;
	},

	getQueryPredictions: function(input) {
		return new Ember.RSVP.Promise(function(resolve, reject) {
			WA.Gmaps.PlacesAutocompleteService.getQueryPredictions({ input: input }, function (predictions, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					resolve(predictions);
				} else {
					reject(status);
				}
			});
		});
	},

	findBestQuery: function(originalQuery, forceOriginal) {
		if (forceOriginal || "".distance == undefined) {
			return new Ember.RSVP.Promise(function(resolve, reject) { resolve(originalQuery) });
		} else {
			return this.getQueryPredictions(originalQuery).then(function(predictions) {
				var words = predictions.map(function(prediction) {
					return prediction.terms;
				}).reduce(function(result, terms) {
					return result.concat(terms);
				}).map(function(term) {
					return term.value.toLowerCase();
				}).reduce(function(result, prediction) {
					return result.concat(prediction.split(/[\s,]+/));
				}, []).uniq();

				var newQuery = originalQuery.split(" ").map(function(keyword) {
					// for each keyword, find its best alternative
					return words.sort(function(a, b) {
						return (b.distance(keyword) - a.distance(keyword));
					})[0];
				}).join(" ");

				return newQuery;
			}, function(error) {
				console.log('query predictions failed:' + error);
				return originalQuery;
			});
		}
	},

	executeQuery: function (query) {
		var self = this;
		return self._loadWanderantItems(query).then(function (wanderantItems) {
			return self._getGoogleItems(query).then(function (googleItems) {

				var allItems = Ember.ArrayProxy.create({ content: [] });

				allItems.addObjects(wanderantItems);
				allItems.addObjects(googleItems);

				if (typeof("".distance) == "function") {
					return allItems.toArray().sort(function (a, b) {
						return self.searchRank(b, query, wanderantItems, googleItems) - self.searchRank(a, query, wanderantItems, googleItems);
					});
				} else {
					return allItems.toArray();
				}
			});
		});
	},

	findWanderantItemByRef: function(placeId){
		var self = this;
		return promiseFromUrl('/api/ember2/items/ref_search', {ref: placeId})
			.then(function(data){
				var store = self.get('store');
				var item = store.push(store.normalize('item', data.data));
				return item;
			}, function(rejection){
				if (rejection.status == 404) return false;
			});
	}

});