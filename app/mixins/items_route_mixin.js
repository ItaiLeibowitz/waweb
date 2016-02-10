import Ember from 'ember';
import RouteWithMap from "waweb/mixins/route-with-map";
import ItemMetaSetup from 'waweb/mixins/item-meta-setup';



export default Ember.Mixin.create(RouteWithMap, ItemMetaSetup, {
	templateName: 'item.items',
	controllerName: 'items',
	cacheKey: Ember.computed.alias('wanderantUrlKey'),
	/*wanderantItemsMinLength: 6,
	withGoogleItems: false,
	withSections: false,
   	mainSectionName: 'things to do',
	googleSectionName: Ember.computed.alias('subRouteName'),
	*/



	beforeModel: function(transition) {
		this._super(transition);
		this.set('mainItem', this.modelFor('item'));
		this.set('mainItemId', this.modelFor('item').get('id'));
	},

	model: function(params){
		var self = this,
			item = this.get('mainItem'),
			store = this.get('store'),
			cacheKey = this.get('cacheKey');
		var cachedItems = item.get(cacheKey);
		if (cachedItems) {
			self.set('hasMore', item.get(cacheKey+"More"));
			return cachedItems;
		}
		return this._getWanderantItems().then(function(data) {
			var items = new Array(data.data.length);

			for (var i = 0; i < data.data.length; i++) {
				var item = store.push(store.normalize('item', data.data[i]));
				items[i] = item;
			}

			if (data.meta) {
				self.set('hasMore', data.meta.more);
			}
			return items;
		});
	},

	setupController: function(controller, model){
		this._super(controller, model);
		var mainItem  = this.modelFor('item');
		var cacheKey = this.get('cacheKey');
		mainItem.set(cacheKey, model);
		mainItem.set(cacheKey+"More", this.get('hasMore'));
		controller.setProperties({
			mainItem: mainItem,
			pathType: this.get('wanderantUrlKey'),
			pageDescription: this.pageDescription(mainItem, model),
			hasMore: this.get('hasMore'),
			cacheKey: this.get('cacheKey')
		});
		//Setup map items
		var map = this.get('mapService');
		map.set('markerItems', model);
		//Photo array
		var photosArr = model.map(function(item){ return {image:item.get('largeImageStyle'), id:item.get('id')}});
		var n = photosArr.length;
		controller.set('photoArray', photosArr);
		var addedProperties = this.get('addedControllerProperties');
		if (addedProperties){
			Object.keys(addedProperties).forEach(function(key){
				controller.set(key, addedProperties[key]);
			})
		}
	},


	wanderantUrlKey: Ember.computed.alias('subRouteName'),
	wanderantUrl: function() {
		return '/api/ember2/items/' + this.get('mainItemId') + '/' + this.get('wanderantUrlKey');
	}.property('mainItemId', 'wanderantUrlKey'),


	_getWanderantItems: function() {
		return Ember.$.getJSON(this.get('wanderantUrl'), this.get('requestParams'));
	},






/*
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
	}*/

});

