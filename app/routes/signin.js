import Ember from "ember";
import AuthenticationRoute from 'waweb/mixins/authentication-route';

export default Ember.Route.extend(AuthenticationRoute, {
	setPageTitle: function() {
		this.set('pageTitle', 'Sign in | Wanderant');
	},
});