import Ember from 'ember';

export default Ember.Component.extend({
	adsService: Ember.inject.service('ads-content'),
	classNames: ['cards-holder'],
	model: null,
	addedCardClass: null,
	addedCardClass2: "itai",
	showAds: true,

	childWrappers: function () {
		var wrappers = this.get('model').map(function (item) {
			return Ember.Object.create({ // wrapper object
				item: item,
				withInfo: false,

				hideInfo: function(){
					this.set('withInfo', false);
				}
			});
		});



		if (wrappers.length > 1 && this.get('showAds')) {
			var ads = this.get('adsService.ads');
			ads.shuffle();
			wrappers.splice(2, 0, ads[0]);
			wrappers.splice(6, 0, ads[1]);
			wrappers.splice(11, 0, ads[2]);
		}

		return wrappers
	}.property('model.[]'),


	actions: {
		resetAllCards: function () {
			this.get('childWrappers').invoke('hideInfo');
		}

	}
	});