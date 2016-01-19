import Ember from 'ember';
import Constants from 'waweb/appconfig/constants';
import ItemTypeConversions from 'waweb/mixins/item-type-conversions';

export default Ember.Mixin.create(ItemTypeConversions, {
	normalizeGoogleItem: function (data, index, isPartialResponse, existingId) {
		// Set up the data that is included in all responses, even partial ones from Search response
		var itemType = this.getItemType(data);
		var address_comps = data.formatted_address ? data.formatted_address.split(", ") : null,
			country = address_comps instanceof Array ? address_comps[address_comps.length - 1] : null;
		var objectToCreate = {
			name: data.name,
			gmapsReference: data.place_id,
			imageBaseUrl: data.photos ? data.photos[0].getUrl({maxWidth: 3000}).replace(/w3000/, '%@') : null,
			imageProvider: data.photos ? Constants.GOOGLE_IMAGES : null,
			googleIcon: data.icon,
			address: data.formatted_address,
			latitude: data.geometry.location.lat(),
			longitude: data.geometry.location.lng(),
			itemType: itemType,
			category: data.types ? data.types.join(', ') : null,
			duration: (itemType && Constants.ITEM_TYPES_ARRAY[itemType]) ? Constants.ITEM_TYPES_ARRAY[itemType].duration : 3600,
			rating: Math.round(data.rating * 10), // our rating system is in integers between 0 and 50, google's is 0-5
			phone: data.international_phone_number || data.formatted_phone_number,
			id: existingId || null, //('tmp' + Math.random()),
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
		var self = this;
		if (data.types && data.types.length > 0) {
			var response = data.types.reduce(function (previousValue, googleType) {
				var waType = Constants.GOOGLE_PLACES_TYPE_CONVERSION[googleType] || googleType;
				return previousValue || self.itemTypeFromName(waType)
			}, null);
			return response
		}
	}
});
