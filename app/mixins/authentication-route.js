import Ember from 'ember';

export default Ember.Mixin.create({
	templateName: 'login',
	setupController: function(controller, model){
		this._super(controller, model);
		controller.setAsCurrentForm();
	}
});

