import FB from 'ember-cli-facebook-js-sdk/fb';

export default {
	name: 'fb',
	initialize: function() {
		return FB.init({
			appId: "<%= ENV['FACEBOOK_APP_ID'] %>",//'525379890964943',
			version: 'v2.3',
			xfbml: true
		});
	}
};