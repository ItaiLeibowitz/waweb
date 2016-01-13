import Ember from 'ember';

var ItemsRouteMixin = Ember.Mixin.create({
	store: Ember.inject.service('store'),
	wanderantItemsMinLength: 6,
	withGoogleItems: false,
	withSections: false,

	mainSectionName: 'things to do',
	googleSectionName: Ember.computed.alias('subRouteName'),
	wanderantUrlKey: Ember.computed.alias('subRouteName'),
	cacheKey: Ember.computed.alias('subRouteName'),
	wanderantUrl: function() {
		return '/api/ember2/items/' + this.get('mainItemId') + '/' + this.get('wanderantUrlKey');
	}.property('mainItemId', 'wanderantUrlKey'),


	cachedItems: function(cacheKey) {
		cacheKey = (cacheKey || this.get('cacheKey'));
		var cachedItems = this.get('mainItem').get(cacheKey);

		if (!Ember.isEmpty(cachedItems)) {
			return cachedItems;
		} else {
			return false;
		}
	},

	loadItems: function() {
		var self = this;
		var withGoogleItems = this.get('withGoogleItems');
		var withSections = this.get('withSections');
		var wanderantItemsMinLength = this.get('wanderantItemsMinLength');
		var loadType = this.get('cacheKey');

		return self._loadWanderantItems(loadType).then(function(wanderantItems) {
			var wanderantItemsLength = wanderantItems.get('length');
			if (!withGoogleItems || (wanderantItemsLength > wanderantItemsMinLength)) {
				return wanderantItems;
			} else {
				return self._loadGoogleItems(loadType).then(function(googleItems) {
					if (wanderantItemsLength == 0) {
						return googleItems;
					} else {
						if (withSections) self._createSections(wanderantItems, googleItems);
						return wanderantItems.toArray().concat(googleItems.toArray());
					}
				});
			}
		});
	},

	_loadWanderantItems: function(cacheKey) {
		var self = this;
		var item = this.get('mainItem');

		return this._getWanderantItems().then(function(data) {
			var items = self.store.loadMany('item', { items: data.items });

			if (cacheKey) item.addToCache(cacheKey, items);
			if (data.more) self.set('hasMoreItems', data.more);

			return items;
		}, function (jqXHR) {
			console.log('wanderant items failed', jqXHR);
			return [];
		});
	},

	_loadGoogleItems: function(cacheKey) {
		var item = this.get('mainItem');

		return this._getGoogleItems().then(function(data) {
			if (cacheKey) item.addToCache(cacheKey, data.toArray());

			return data;
		});
	},

	_getWanderantItems: function() {
		return Ember.$.getJSON(this.get('wanderantUrl'), this.get('requestParams'));
	},

	// override if needed
	_getGoogleItems: function() {
		return this._getGoogleItemsFromTextQuery();
	},

	_getGoogleItemsFromTextQuery: function() {
		var self = this;
		var item = this.get('mainItem');
		var store = this.store;
		var adapter = this.googleItemAdapter;

		var query = this.get('subRouteName') + ' in ' + item.get('name');

		return adapter.googleTextQuery(query).then(function (data) {
			self._setDataAncestry(data, item);
			return data;
		}).then(function (data) {
			return adapter.combineWithWanderant(data, store);
		}, function (status) {
			console.log('google text query failed', status);
			return [];
		});
	},

	_getGoogleItemsFromTypeQuery: function() {
		var self = this;
		var item = this.get('mainItem');
		var store = this.store;
		var adapter = this.googleItemAdapter;

		var types = WA.constants.GoogleAttractionTypeArray;
		var location = new google.maps.LatLng(item.get('latitude'), item.get('longitude'));
		var radius = WA.radiusByItemType(item.get('itemType'));

		return adapter.googleTypeQuery(types, location, radius).then(function (data) {
			self._setItemPagination(data, item);
			self._setDataAncestry(data.results, item);

			return data.results;
		}).then(function (data) {
			return adapter.combineWithWanderant(data, store);
		}, function (status) {
			console.log('google type query failed:', status);
			return [];
		});
	},

	_setItemPagination: function(data, item) {
		var item = this.get('mainItem');
		if (data.nextPage && data.nextPage.hasNextPage) {
			// REMOVING THE HAS MORE ITEMS FLAG UNTIL WE FIX LOADING MORE GOOGLE ITEMS (IF WE DO...)
			//self.set('hasMoreItems', data.nextPage.hasNextPage);
			item.set('nextPage', data.nextPage);
		}
	},

	_setDataAncestry: function(data, item) {
		data.forEach(function(subItem) {
			subItem.ancestry = item.get('ancestry')+"/"+item.get('id');
			subItem.ancestryDepth = item.get('ancestryDepth') + 1;
			subItem.ancestryNames = item.get('ancestryNames')+"/"+item.get('name');
		});
	},

	_createSections: function(wanderantItems, googleItems) {
		var item = this.get('mainItem');

		var wanderantContent = wanderantItems.map(function(wanderantItem, index) {
			return { type: "item", order: index, id: wanderantItem.get('id') };
		});
		var googleContent = googleItems.map(function(googleItem, index) {
			return { type: "item", order: index, id: googleItem.get('id') };
		});

		var sections = [
			{ name: "Top %@ %@ in %@".fmt(wanderantItems.get('length'), this.get('mainSectionName'), item.get('name')), content: wanderantContent, isAutomatic: true},
			{ name: "Additional %@ in and around %@".fmt(this.get('googleSectionName'), item.get('name')), content: googleContent, isAutomatic: true}
		];

		this.set('sections', sections);
		item.set('sections', sections);
	}

});

export default ItemsRouteMixin;