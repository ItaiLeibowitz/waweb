import Ember from 'ember';

export default Ember.Mixin.create({
	templateName: 'login',
	forceMetatags: true,
	setupController: function(controller, model){
		this._super(controller, model);
		controller.setAsCurrentForm();
	}
});

