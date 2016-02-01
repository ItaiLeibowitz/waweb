import Ember from 'ember';

export default Ember.Service.extend({
	component: null,
	isShowing: false,

	feedbackSentence: 'This will be the standard sentence',
	feedbackLinkRoute: null,
	feedbackLinkTarget: null,
	feedbackLinkModel: null,
	feedbackActionName: null,
	feedbackAddedClass: null,
	feedbackAction: function () {
		console.log('running the action')
	},


});