import Ember from 'ember';


export function initialize(application){

	Ember.Route.reopen({
		targetsWithScrollDelay: ['search', 'signin', 'signup', 'forgotten-password'],


		afterModel: function(model, transition, queryParams){
			this._super(model, transition, queryParams);

			if (model || this.get('forceMetatags')) {
				this.setModelForRouteResolver(model);
				this.setPageTitle(model);
				this.setPageMetaDescription(model);
				this.setPageMetatags(model);
				// set shareable model for share buttons
				//if (this.get('setModelToShare')) cm.set('shareableModel', model);

				Ember.run.schedule('afterRender', this, '_applyTitle');
				Ember.run.schedule('afterRender', this, '_applyMetatags');
			}

		},

		// Override this function as needed
		setModelForRouteResolver: function(model) {
			this.set('modelForRouteResolver', model);
		},

		// Override this function as needed
		setPageTitle: function(model) {},

		// Override this function as needed
		setPageMetaDescription: function(model) {},

		// Override this as needed
		setPageMetatags: function(model) {},


		// Convenience title function to use
		setPageTitleFromModel: function(model) {
			this.set('pageTitle', model.get('name')) + " | Wanderant";
		},

		// Convenience description function to use
		setPageMetaDescriptionFromModel: function(model) {
			this.set('pageMetaDescription', model.get('oneliner'));
		},

		// Convenience metatags function to use
		setPageMetatagsFromModel: function(model) {
			var metaProperties = {};
			var metaNames = {};
			var urlPiecesToHideRegex = /\/(overview|attractions|restaurants|nightlife|destinations|cities|regions)/g;

			metaNames["description"] = this.get('pageMetaDescription');

			metaProperties["og:title"] = model.get('name');
			metaProperties["og:description"] = this.get('pageMetaDescription');
			metaProperties["og:url"] = "https://www.wanderant.com" + this.get('router.url').replace(urlPiecesToHideRegex,"");
			metaProperties["og:image"] = model.get('largeImage');
			metaProperties["place:location:latitude"] = model.get('latitude');
			metaProperties["place:location:longitude"] = model.get('longitude');

			this.set('pageMetatags', { name: metaNames, property: metaProperties });
		},


		_applyTitle: function(){
			var title = this.get('pageTitle');
			$(document).attr('title', title);
		},

		_applyMetatags: function() {
			var metatags = this.get('pageMetatags') || {};
			Object.keys(metatags).forEach(function(type) {
				Object.keys(metatags[type]).forEach(function(key) {
					var value = metatags[type][key];
					Ember.$(`meta[${type}=\"${key}\"]`).attr('content', value);
				});
			});
		},




		actions: {
			willTransition: function(transition){
				// Chrome on iOS has a weird bug - it disables scrollTop and that interferes when moving from a scrolled page to, say, search - it disappears.
				// What this little hack does is it delays the transition by a bit in order to let the page scrolling happen first before chrome stops it.
				this._super(transition);
				$(document).scrollTop(0);
				if (this.get('targetsWithScrollDelay').indexOf(transition.targetName) > -1) {
					if (!this.get('allowDelayedTransition')) {
						var self = this;
						transition.abort();
						Ember.run.later(this, function () {
							self.set('allowDelayedTransition', true);
							transition.retry();
						}, 100)
					} else {
						this.set('allowDelayedTransition', null);
					}
				}
			}
		}
	})

};


export default {
	name: 'extend-route',
	initialize: initialize
};