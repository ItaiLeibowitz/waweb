WA.GoogleItemAdapter = DS.ActiveModelAdapter.extend({


	createFullItemFromReference: function(reference){
		var self = this,
			store = WA.Item.store;
		return this.googlePlaceIdGoogleQuery(reference)
			.then(function (data) {
				var itemObj = self.normalizeGoogleItem(data, null);
				var item = store.createRecord('item',itemObj);
				gaSend('send', 'event', 'search', 'google place_id search', 'success');
				return item.save();
			}, function (status) {
				console.log('can not find item on Google either', status);
				gaSend('send', 'event', 'search', 'google place_id search', status);
				return false;
			});
	},


	// This query will check a placeId on Wanderant
	googlePlaceIdWanderantQuery: function(placeId){
		return Ember.RSVP.promiseFromUrl('/api/ember/items/ref_search', {ref: placeId})
	},

	// This query will check a placeId on Google Places
	googlePlaceIdGoogleQuery: function (placeId) {
		return WA.waitUntil(null, function() { return WA.Gmaps.PlacesService; }).then(function(placesService) {
			return new Ember.RSVP.Promise(function (resolve, reject) {
				placesService.getDetails({placeId: placeId}, function (result, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						Ember.run(null, resolve, result);
					} else {
						Ember.run(null, reject, status);
					}
				})
			});
		});
	},

	googleTypeQuery: function(types, location, radius, nextPageToken) {
		var query = {location: location, radius: radius, types: types};
		if (nextPageToken) query = {pagetoken: nextPageToken};

		return WA.waitUntil(null, function() { return WA.Gmaps.PlacesService; }).then(function(placesService) {
			return new Ember.RSVP.Promise(function(resolve, reject) {
				placesService.nearbySearch(query, function(results, status, next_page_token) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						gaSend('send', 'event', 'search', 'google nearby search', location);
						console.log(results, status, next_page_token)
						Ember.run(null, resolve, {results: results, nextPage: next_page_token});
					} else {
						gaSend('send', 'event', 'search', 'google nearby search', status);
						Ember.run(null, reject, status);
					}
				})
			});
		});
	},

	googleTextQuery: function(query, location) {
		if (undefined === location) {
			var request = {query: query};
		} else {
			var request = {query: query, location: location, radius: 1000};
		}

		return WA.waitUntil(null, function() { return WA.Gmaps.PlacesService; }).then(function(placesService) {
			return new Ember.RSVP.Promise(function(resolve, reject) {
				placesService.textSearch(request, function(results, status) {
				  if (status == google.maps.places.PlacesServiceStatus.OK) {
					  gaSend('send', 'event', 'search', 'google place keyword search', query);
					  Ember.run(null, resolve, results);
				  } else {
					  gaSend('send', 'event', 'search', 'google place keyword search', status);
					  Ember.run(null, reject, status);
				  }
				})
			});
		});
	},

	combineWithWanderant: function(googleData, store, options){
		options = options || {};
		// see if we can get wanderant results for any of these via their placeIds
		var placeIdArray = googleData.reduce(function(previousValue, result){
			return previousValue.concat(result.place_id)
		},[]);
		var	self = this;

		return $.getJSON('/api/ember/items/ref_batch_search', {refs: placeIdArray})
			.then(function(wanderantData){
				return self.normalizeMixedWanderantGoogleData(googleData, wanderantData, store, {previousWanderantItems: options.previousWanderantItems, index: options.index})
			})
	},

	normalizeGoogleItem: function (data, index, isPartialResponse, existingId) {
		// Set up the data that is included in all responses, even partial ones from Search response
		var itemType = this.getItemType(data);
		var address_comps = data.formatted_address ? data.formatted_address.split(", ") : null,
			country = address_comps instanceof Array ? address_comps[address_comps.length - 1] : null;
		var objectToCreate = {
			name: data.name,
			gmapsReference: data.place_id,
			imageBaseUrl: data.photos ? data.photos[0].getUrl({maxWidth: 3000}).replace(/w3000/, '%@') : null,
			imageProvider: data.photos ? WA.constants.GOOGLE_IMAGES : null,
			googleIcon: data.icon,
			address: data.formatted_address,
			latitude: data.geometry.location.lat(),
			longitude: data.geometry.location.lng(),
			itemType: itemType,
			category: data.types ? data.types.join(', ') : null,
			duration: (itemType && WA.constants.ITEM_TYPES_ARRAY[itemType]) ? WA.constants.ITEM_TYPES_ARRAY[itemType].duration : 3600,
			rating: Math.round(data.rating * 10), // our rating system is in integers between 0 and 50, google's is 0-5
			phone: data.international_phone_number || data.formatted_phone_number,
			id: existingId || ('tmp' + Math.random()),
			googleResultOrder: index,
			isGoogle: true,
			needsFullGoogleInfo: isPartialResponse,
			ancestry: data.ancestry,
			ancestryNames: data.ancestryNames || country,
			ancestryDepth: data.ancestryDepth
		};

		// now setup data that's only available in full responses -------------------
		if (!isPartialResponse) {
			if (data.opening_hours) objectToCreate.operatingHours = this.convertGoogleHours(data);

			if (data.website) objectToCreate.externalLinks = [
				{icon: '/assets/info_link.png', text: 'website', source: data.website }
			];

			if (data.address_components) objectToCreate.ancestryObject = data.address_components;
			objectToCreate.googleTypes = data.types;

			objectToCreate.needsWikiContent = true;

			// setup photo caption information
			if (data.photos && data.photos[0].html_attributions.length > 0) {
				if (data.photos[0].html_attributions[0].indexOf('href' != -1)) {
					objectToCreate.captionLink = data.photos[0].html_attributions[0].replace(/(.*)(href=")(.*)(\")(.*)/, '$3');
					objectToCreate.captionName = data.photos[0].html_attributions[0].replace(/(.*)(\>)(.*)(\<)(.*)/, '$3');
					objectToCreate.captionCc = "all rights reserved";
				} else {
					objectToCreate.captionName = data.photos[0].html_attributions[0];
					objectToCreate.captionCc = "all rights reserved";
				}

			} else {
				objectToCreate.captionName = "Google";
				objectToCreate.captionCc = "No known copyright restrictions";
			}


		}

		/*var item = store.createRecord('item', objectToCreate);

		// get info from Wikipedia if this is a full response
		if (!isPartialResponse) {
			var self = this;
			Ember.run(function () {
				self.getWikiLink(data.name, item)
			});
		}*/

		return objectToCreate
	},

	normalizeMixedWanderantGoogleData: function(googleData, wanderantData, store, options) {
		options = options || {};
		var normalized = Ember.ArrayProxy.create({content:[]}),
			index = options.index || 0,
			self = this,
			foundIds = wanderantData.found_ids,
			foundRecordHash = {},
			allWanderantItems = wanderantData.items;
		if (options.previousWanderantItems) {
			var existingItemsToConcat = [];

			options.previousWanderantItems.forEach(function(prevItem){
				if (foundIds.indexOf(prevItem.gmaps_reference) == -1) {
					existingItemsToConcat.push(prevItem);
				}
			});
			allWanderantItems = wanderantData.items.concat(existingItemsToConcat);
		}

		// create records for the Wanderant data
		allWanderantItems.forEach(function(itemObj){
			var record = store.load('item', itemObj);
			normalized.pushObject(record);
			foundRecordHash[itemObj.gmapsReference] = record;
		});

		googleData.forEach(function(obj){
			// if we found this item, place its order on its item record
			if (wanderantData.found_ids.indexOf(obj.place_id) != -1) {
				foundRecordHash[obj.place_id].set('googleResultOrder', index);
			// else we will create a new record for it
			} else {
				var itemObj = self.normalizeGoogleItem(obj, index, true);
				var item = store.createRecord('item', itemObj);
				normalized.pushObject(item);
			}
			index++;
		});
		return normalized;
	},

	getAncestryFromAddress: function(data){
		var components = data.address_components,
			ancestors = [];
		for (var i = components.length - 1; i >= 0; i--) {
			var place = components[i];
			if (WA.constants.ACCEPTED_GOOGLE_PARENT_TYPES.indexOf(place.types[0]) != -1  && place.types[0] != data.types[0]) {
				ancestors.push(place.long_name)
			}
		}
		// remove too many duplicates
		for (var i = 0; i < ancestors.length; i++) {
			var ancestor = ancestors[i];
			if (ancestor == ancestors[i+1]) ancestors.splice(i+1,1)
		}
		return ancestors.join("/")
	},

	getAncestryObjects: function(ancestryAddress) {
		// check on wanderant if we have a parent with that referenceAlias
		// if we do, get its ancestry and set it appropriately
		// if we don't, create a new item with that address and set it to get from google, set other ancestry params temporarily

	},





	convertGoogleHours: function (data) {
		if (data.opening_hours && data.opening_hours.periods) {
			var periods = data.opening_hours.periods;


			nextDayIndex = function (dayIndex) {
				return (dayIndex + 1) % 7
			};


			prevDayIndex = function (dayIndex) {
				return (dayIndex + 6) % 7
			};

			daysBetween = function (startDayIndex, endDayIndex) {
				if (startDayIndex > endDayIndex) {
					var currentIndex = startDayIndex,
						result = [];
					while (currentIndex != prevDayIndex(endDayIndex)) {
						currentIndex = nextDayIndex(currentIndex);
						result.push(currentIndex);
					}
					return result;
				} else {
					var array = new Array(endDayIndex - startDayIndex + 1);
					for (var i = 0; i < array.length; i++) {
						array[i] = startDayIndex + i;
					}
					return array
				}
			};

			parseTimestring = function (timestring) {
				return parseInt(timestring.slice(0, 2)) * 3600 + parseInt(timestring.slice(2, 4)) * 60
			};

			// local constants
			var startOfDaySeconds = 0,
				endOfDaySeconds = 86400,
				allDayPeriod = [0, 86400];

			// Don't calculate anything if there are no periods
			if (!periods || periods.length == 0) {
				return null;
			}

			//periods = JSON.parse(periods) if periods.class.name == "String"

			// Open 24/7
			if (periods.length == 1 && periods[0].open.time == "0000" && undefined === periods[0].close) {
				var array = new Array(7);
				for (var i = 0; i < array.length; i++) {
					array[i] = [allDayPeriod];
				}
				return array
			}

			//Use this version of Array.new so that all values don't reference the same object
			result = new Array(7);
			for (var i = 0; i < result.length; i++) {
				result[i] = [];
			}

			periods.forEach(function (period) {


				var dayIndexOpen = period.open.day,
					dayIndexClose = period.close.day;

				var timeOpenSeconds = parseTimestring(period.open.time),
					timeCloseSeconds = parseTimestring(period.close.time);
				//open and close on the same day
				if (dayIndexOpen == dayIndexClose) {
					result[dayIndexOpen].push([timeOpenSeconds, timeCloseSeconds])
					// don't open and close on the same day. Example: Bar opens at 16:00 and closes at 04:00 the next day
				} else {
					result[dayIndexOpen].push([timeOpenSeconds, endOfDaySeconds]);
					if (timeCloseSeconds > startOfDaySeconds) {
						result[dayIndexClose].push([startOfDaySeconds, timeCloseSeconds]);
					}

					// if difference between open and close is more than 1 day, set days between as open 24 hours
					if (nextDayIndex(dayIndexOpen) != dayIndexClose) {
						daysBetween(dayIndexOpen, dayIndexClose).forEach(function (dayIndex) {
							result[dayIndex] = [allDayPeriod]
						});
					}
				}
			});
			return result
		} else {
			return null;
		}
	},

	getItemType: function (data) {
		// Take the first type from the data.types and convert it to Wanderant name, then find its type_code
		if (data.types && data.types.length > 0) {
			var response = data.types.reduce(function (previousValue, googleType) {
				waType = WA.convertTypeFromGoogle(googleType);
				return previousValue || WA.itemTypeFromName(waType)
			}, null);
			return response
		}
	}

});


