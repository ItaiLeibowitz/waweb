import Ember from 'ember';
import Autocomplete from 'waweb/mixins/widget';


export default Ember.TextField.extend(Autocomplete, {
	autocomplete_service: Ember.inject.service('places-autocomplete'),
	autocomplete_emberobj: null,
	searchService: Ember.inject.service('search-service'),
	classNames: ['search-field'],
	valueBinding: "query",
	placeholder: "Explore any destination...",
	searchCache: null,

	init: function(){
		this._super();
		this.set('autocomplete_emberobj', this)
	},

	didInsertElement: function() {
		this.setupWidget();
		this.set('parentView.wrappedField', this);
	},

	//clear search term on focus
	focusIn: function(){
		//this.set('value', null);
	},

	autocomplete_source: function(request, response) {
		// TODO: add params for location biasing acc. to:
		// https://developers.google.com/maps/documentation/javascript/reference#QueryAutocompletionRequest
		var self = this;
		this.options['service'].get('service').getQueryPredictions({ input: request.term }, function (predictions, status) {
			if (status != google.maps.places.PlacesServiceStatus.OK) {
				return;
			}
			self.options['emberobj'].set('searchCache', predictions);
			response($.map(predictions, function (prediction, i) {
				return {
					label: prediction.description
				}
			}));
		});
	},

	autocomplete_select: function (event, ui) {
		// find the relevant prediction from the full set
		var selectedPrediction = this.get('searchCache').find(function(prediction){
			return prediction.description == ui.item.value;
		});

		// run wanderant search on the selected place_id
		var self = this;
		this.$().autocomplete('close');
		this.$().blur();

		// if user selected a specific place, we immediately look for it in Wanderant's db then google's
		if (selectedPrediction.place_id) {
			this.get('searchService').findWanderantItemByRef(selectedPrediction.place_id)
				.then(function(item) {
					if (item) {
						self.sendAction('foundItem', 'item', item.get('slug'));
					} else {
						self.get('searchService').buildItemFromGoogle(selectedPrediction.place_id)
							.then(function(item){
								if (item) {
									self.sendAction('foundItem', 'item', item.get('slug'));
								} else {
									console.log('no results found')
								}
							})
					}
				});
		} else {
			//submit the search
			self.get('parentView').send('submit', this.get('query'));
		}
	},

	actions: {
		clearSearch: function(){
			this.set('query', '');
		}
	}

});