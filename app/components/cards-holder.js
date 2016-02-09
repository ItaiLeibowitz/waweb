import Ember from 'ember';

export default Ember.Component.extend({
	adsService: Ember.inject.service('ads-content'),
	classNames: ['cards-holder'],
	classNameBindings: ['isMinimized','withMoreHolder'],
	isMinimized: false,
	model: null,
	addedCardClass: null,
	showAds: true,

	// based on method proposed in: http://emberigniter.com/parent-to-children-component-communication/
	childWrappers: function () {
		var self = this,
			addedObjectAttribute = this.get('addedCardAttribute');
		var wrappers = this.get('model').map(function (item, index) {
			var object = Ember.Object.create({ // wrapper object
				item: item,
				index: index + 1,
				minimize: function() {
					this.set('isExpanded', false);
				}
		});

			if (addedObjectAttribute) {object.set(addedObjectAttribute, true)};
			return object;
		});


		// Enable the following to add back the ads - but check that it's working when you click on them
		//TODO: IMPORTANT: see if we remove the collection tags from ads - or at least why it doesn't work when you try to add them.
		/*if (wrappers.length > 1 && this.get('showAds')) {
			var ads = this.get('adsService.ads');
			ads.shuffle();
			wrappers.splice(2, 0, ads[0]);
			wrappers.splice(6, 0, ads[1]);
			wrappers.splice(11, 0, ads[2]);
		}*/

		return wrappers
	}.property('model.[]'),


	actions: {
		resetAllCardsInfo: function () {
			this.get('childWrappers').invoke('hideInfo');
		},
		resetAllCardsSize: function () {
			this.get('childWrappers').invoke('minimize');
		}

	}
	});