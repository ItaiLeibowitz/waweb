import Ember from 'ember';


var Constants = Ember.Object.create({
	ITEM_TYPES_BY_NAME: {"COUNTRY": 3,
		"NEIGHBORHOOD": 90,
		"ATTRACTION": 100
	},
	CDN_PATH_1: 'https://da37ts4zp7h49.cloudfront.net/photos/',
	CDN_PATH_2: 'https://d6fva57a21sq7.cloudfront.net/photos/',
	WANDERANT_IMAGES: 0,
	GOOGLE_IMAGES: 1,
	FLICKR_IMAGES: 2,
	PANORAMIO_IMAGES: 3,
	WIKIPEDIA_IMAGES: 5,
	ARBITRARY_IMAGES: 7,
	IMAGE_PROVIDERS: [
		{
			provider_id: 0,
			provider_name: "Wanderant",
			sizes: [
				{ name: "small", token: "small", max_width: 200 },
				{ name: "medium", token: "medium", max_width: 400 },
				{ name: "large", token: "large", max_width: 1200 }
			]
		},
		{
			provider_id: 1,
			provider_name: "Google",
			sizes: [
				{ name: "small", token: "w100", max_width: 100 },
				{ name: "medium", token: "w500", max_width: 500 },
				{ name: "large", token: "w3000", max_width: 3000 }
			]
		},
		{
			provider_id: 2,
			provider_name: "Flickr",
			sizes: [
				{ name: "small", token: "m", max_width: 240 },
				{ name: "medium", token: "z", max_width: 640 },
				{ name: "large", token: "b", max_width: 1024 }
			]
		},
		{
			provider_id: 3,
			provider_name: "Panoramio",
			sizes: [
				{ name: "small", token: "small", max_width: 240 },
				{ name: "medium", token: "medium", max_width: 640 },
				{ name: "large", token: "original", max_width: 1024 }
			]
		},
		{
			provider_id: 4,
			provider_name: "Google_street_view",
			sizes: [
				{ name: "small", token: "200x125", max_width: 240 },
				{ name: "medium", token: "320x200", max_width: 640 },
				{ name: "large", token: "640x400", max_width: 1024 }
			]
		},
		{
			provider_id: 5,
			provider_name: "Wikipedia",
			sizes: [
				{ name: "small", token: "150", max_width: 150 },
				{ name: "medium", token: "500", max_width: 500 },
				{ name: "large", token: "1024", max_width: 1024 }
			]
		},
		{
			provider_id: 6,
			provider_name: "Twobits",
			sizes: [
				{ name: "small", token: "200x125", max_width: 240 },
				{ name: "medium", token: "320x200", max_width: 640 },
				{ name: "large", token: "1000x1000", max_width: 1024 }
			]
		},
		{
			provider_id: 7,
			provider_name: "Arbitrary",
			sizes: [
				{ name: "small", token: "a", max_width: 240 },
				{ name: "medium", token: "a", max_width: 640 },
				{ name: "large", token: "a", max_width: 1024 }
			]
		},
	]




	/*baseTimeUnit: <%= BASE_TIME_UNIT %>,
	baseTimeUnitsPerDay: <%= BASE_TIME_UNITS_PER_DAY %>,

	baseHeight: <%= BASE_HEIGHT_PX %>,
	baseWidth: <%= DAY_CALENDAR_WIDTH + 2 * DAY_CALENDAR_MARGIN %>,
	EARTH_RADIUS_KM: <%= EARTH_RADIUS_KM %>,
	DEG_TO_RAD: <%= DEG_TO_RAD %>,
	AVG_SPEED_KPH: <%= AVG_SPEED_KPH %>,
	PER_PAGE: <%= PER_PAGE %>,
	DEFAULT_PAGE_TITLE: "<%= DEFAULT_PAGE_TITLE %>",
	MAX_PAGE_TITLE_LENGTH: <%= MAX_PAGE_TITLE_LENGTH %>,
	MAX_ITEM_WITH_TYPE_IN_PARENT_LENGTH: <%= MAX_ITEM_WITH_TYPE_IN_PARENT_LENGTH %>,
	ITEM_PAGE_TITLE_MAPPINGS: <%= ITEM_PAGE_TITLE_MAPPINGS.to_json %>,
	ITEM_META_DESCRIPTIONS: <%= ITEM_META_DESCRIPTIONS.to_json.gsub('%s', '%@') %>,
	TRIP_META_DESCRIPTION: <%= TRIP_META_DESCRIPTION.to_json.gsub('%s', '%@') %>,
	TimeUnitEnum: {
		SECOND: <%= SECOND %>,
		MINUTE: <%= MINUTE %>,
		TEN_MINUTES: <%= TEN_MINUTES %>,
		FIFTEEN_MINUTES: <%= FIFTEEN_MINUTES %>,
		TWENTY_MINUTES: <%= TWENTY_MINUTES %>,
		THIRTY_MINUTES: <%= THIRTY_MINUTES %>,
		HOUR: <%= HOUR %>,
		DAY: <%= DAY %>
	},
	DAY_NAMES: <%= DAY_NAMES %>,
	UserRoleEnum: {
		OWNER: <%= TRIP_OWNER %>,
		EDITOR: <%= TRIP_EDIT %>,
		COMMENTER: <%= TRIP_COMMENT %>,
		VIEWER: <%= TRIP_VIEW %>
	},
	ATTRACTION_BLOCK: <%= ATTRACTION_BLOCK %>,
	PARENT_BLOCK: <%= PARENT_BLOCK %>,
	TRAVEL_TYPES: <%= TRAVEL_TYPES.to_json %>,
	TRAVEL_TYPE_NAMES: <%= TRAVEL_TYPE_NAMES %>,
	MIN_LATLNG_BOUND: <%= MIN_LATLNG_BOUND %>,
	INTERESTING_SECTIONS: <%= INTERESTING_SECTIONS %>,
	UNINTERESTING_SECTIONS: <%= UNINTERESTING_SECTIONS %>,
	GOOGLE_PLACES_TYPE_CONVERSION: <%= GOOGLE_PLACES_TYPE_CONVERSION.to_json %>,
	GOOGLE_DESTINATIONS_ITEM_TYPES: [
		{googleType: "establishment", WaType: <%= ITEM_TYPES["ATTRACTION"] %>},
		{googleType: "locality", WaType: <%= ITEM_TYPES["CITY"] %>},
		{googleType: "sublocality", WaType: <%= ITEM_TYPES["CITY"] %>},
		{googleType: "country", WaType: <%= ITEM_TYPES["COUNTRY"] %>},
		{googleType: "administrative_area_level_1", WaType: <%= ITEM_TYPES["REGION"] %>},
		{googleType: "administrative_area_level_2", WaType: <%= ITEM_TYPES["REGION"] %>},
		{googleType: "administrative_area_level_3", WaType: <%= ITEM_TYPES["REGION"] %>}
	],
	GoogleAttractionTypeArray: ["amusement_park", "aquarium", "amusement_park", "casino", "cemetery", "church", "city_hall", "hindu_temple", "library", "mosque", "movie_theater", "museum", "park", "place_of_worship", "shopping_mall", "spa", "stadium", "synagogue", "zoo"],
	flickrLicenses: {
		0: "All Rights Reserved",
		1: "Attribution-NonCommercial-ShareAlike",
		2: "Attribution-NonCommercial",
		3: "Attribution-NonCommercial-NoDerivs",
		4: "Attribution",
		5: "Attribution-ShareAlike",
		6: "Attribution-NoDerivs",
		7: "No known copyright restrictions",
		8: "United States Government Work"
	},
	FLICKR_CC_LICENSES_IDS: "<%= FLICKR_CC_LICENCES_IDS %>",
	FLICKR_CC_NC_LICENSES_IDS: "<%= FLICKR_CC_NC_LICENCES_IDS %>",
	CDN_PATH_1: "<%= CDN_PATH_1 %>",
	CDN_PATH_2: "<%= CDN_PATH_2 %>",
	CDN_PATH_VIDEOS: "<%= CDN_PATH_1.gsub('photos/','videos/back/') %>",
	BACKGROUND_VIDEO_COUNT: 30,
	IMAGE_PROVIDERS: <%= IMAGE_PROVIDERS.to_json %>,
	WANDERANT_IMAGES: <%= WANDERANT_IMAGES %>,
	GOOGLE_IMAGES: <%= GOOGLE_IMAGES %>,
	FLICKR_IMAGES: <%= FLICKR_IMAGES %>,
	PANORAMIO_IMAGES: <%= PANORAMIO_IMAGES %>,
	WIKIPEDIA_IMAGES: <%= WIKIPEDIA_IMAGES %>,
	ARBITRARY_IMAGES: <%= ARBITRARY_IMAGES %>,
	WanderantBaseUrl: "https://www.wanderant.com",

	DUPLICATES_STEP: <%= DUPLICATES_STEP %>,
	ITEM_TYPES_BY_NAME: {},
	ITEM_TYPES_ARRAY: <%= ITEM_TYPES_ARRAY.to_json %>,
	PROMINENCE_BASE: <%= PROMINENCE_BASE %>,
	ANCESTRY_TREE_MAX_DEPTH: <%= ANCESTRY_TREE_MAX_DEPTH %>,
	SURVEY_OPTIONS: ["purpose", "addl_info", "improve"],
	SECTION_ORDER: ["Famous for", "Main destinations", "If you're into...", "Top attractions", "Suggested itineraries", "Good for a day trip"],
	REVIEW_SOURCE_NAMES: <%= REVIEW_SOURCE_NAMES %>*/
});

export default Constants;