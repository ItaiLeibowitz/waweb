import Ember from 'ember';


export function initialize(application){
	// This file extends Array.Prototype with Ember default functions, as well as our own custom functions
// In order to do this, Ember.EXTEND_PROTOTYPES must be set to false for Array - before ember.js loads
// After that - we call Ember.NativeArray.activate to add all NativeArray functions to Array.prototype

	Array.prototype.shuffle = function(){
		var counter = this.length, temp, index;

		// While there are elements in the array
		while (counter > 0) {
			// Pick a random index
			index = (Math.random() * counter--) | 0;

			// And swap the last element with it
			temp = this[counter];
			this[counter] = this[index];
			this[index] = temp;
		}
	};

};


export default {
	name: 'extend-array',
	initialize: initialize
};