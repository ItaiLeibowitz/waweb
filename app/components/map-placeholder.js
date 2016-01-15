import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['map-holder'],
	willDestroyElement: function(){
		var includedMap = this.$('.map-canvas')[0];
		if (includedMap) {
			$('#actual-map').appendTo('#original-map-placeholder');
		}
	}
});