import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement: function(){
	$('.initial-view').addClass('initial-moved');
		Ember.run.later(this, function(){
			$('.initial-view').remove();
		}, 1200);
	}
});