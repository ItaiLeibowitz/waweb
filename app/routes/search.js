import Ember from "ember";

export default Ember.Route.extend({
	setPageTitle: function() {
		this.set('pageTitle', 'Search | Wanderant');
	},
	needsScrollDelay: true,
	scrollDelayPrimed: true
});