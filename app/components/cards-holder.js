import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['cards-holder'],
	model: null,

	childWrappers: function () {
		return this.get('model').map(function (item) {
			return Ember.Object.create({ // wrapper object
				item: item,
				withInfo: false,

				hideInfo: function(){
					this.set('withInfo', false);
				}
			});
		});
	}.property('model.[]'),


	actions: {
		resetAllCards: function () {
			this.get('childWrappers').invoke('hideInfo');
		}

	}
	});