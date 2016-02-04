import Ember from 'ember';

export default Ember.Component.extend({
	mainImage: Ember.inject.service('main-image'),
	orientationService: Ember.inject.service('orientation-service'),
	classNames: ['main-image'],
	classNameBindings: ['isExpanded'],
	imageStyle: Ember.computed.alias('mainImage.imageStyle'),
	captionName: Ember.computed.alias('mainImage.captionName'),
	captionLink: Ember.computed.alias('mainImage.captionLink'),
	captionCc: Ember.computed.alias('mainImage.captionCc'),
	isExpanded: Ember.computed.alias('mainImage.isExpanded'),
	hasOrientation: Ember.computed.and('orientationService.isOn','isExpanded'),



	didInsertElement: function(){
		this._super();
		this.set('mainImage.component', this);
	},

	actions: {
		minimizeImage: function(){
			this.set('mainImage.isExpanded', false);
		},
		toggleOrientation: function(){
			this.toggleProperty('orientationService.isOn');
		}
	}

});