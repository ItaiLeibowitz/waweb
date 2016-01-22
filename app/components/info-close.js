import Ember from 'ember';
import GestureRecognizer from 'waweb/components/gesture-recognizer';

export default GestureRecognizer.extend({
	recognizers: "swipe tap",
	classNames: ["menu-edge"],

	tap: function(){
		this.get('closeAction')();
		return false;
	},
	swipeRight: function(){
		this.get('closeAction')();
	}

});