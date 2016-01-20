import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['photo-card link-card'],
	classNameBindings: ['addedClass'],
	addedClass: null

});