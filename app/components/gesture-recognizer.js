import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default Ember.Component.extend(RecognizerMixin, {
	recognizers: "swipe tap press",

	swipeRight: function(e){
		window.history.go(-1);
		$('#back-indicator').fadeIn(300).delay(700).fadeOut(300);
	}
});