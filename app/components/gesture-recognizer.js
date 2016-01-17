import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(RecognizerMixin, {
	recognizers: "swipe",

	swipeRight: function(e){
		window.history.go(-1);
	}
});