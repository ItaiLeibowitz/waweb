import Ember from 'ember';


export function initialize(application){
	// This file extends Array.Prototype with Ember default functions, as well as our own custom functions
// In order to do this, Ember.EXTEND_PROTOTYPES must be set to false for Array - before ember.js loads
// After that - we call Ember.NativeArray.activate to add all NativeArray functions to Array.prototype
	Ember.Array.reopen({
		/**
		 Converts the enumerable into an array and sorts by the keys
		 specified in the argument. Differs from original sort by allowing descending sort
		 by specifying 'property:desc' as the sort property

		 You may provide multiple arguments to sort by multiple properties.

		 @method sortBy
		 @param {Array} Array of property names to sort on
		 @return {Array} The sorted array.
		 @since 1.2.0
		 */
		sortByExtended: function (sortKeys) {
			if (sortKeys.length == 0) return this.toArray();
			return this.toArray().sort(function (a, b) {
				var sortkeysIsArray = sortKeys.isPrototypeOf(Array);
				if (sortkeysIsArray) {
					var l = sortKeys.length
				} else {
					var l = 1;
				}
				for (var i = 0; i < l; i++) {
					var keyString = sortkeysIsArray ? sortkeys[i] : sortKeys,
						keyArray = keyString.split(':'),
						key = keyArray[0],
						ascFactor = (keyArray[1] && keyArray[1] == "desc") ? -1 : 1;
					var propA = Ember.get(a, key),
						propB = Ember.get(b, key);
					// return 1 or -1 else continue to the next sortKey
					var compareValue = ascFactor * Ember.compare(propA, propB);
					if (compareValue) {
						return compareValue;
					}
				}
				return 0;
			});
		}
	});

};


export default {
	name: 'extend-sort',
	initialize: initialize
};