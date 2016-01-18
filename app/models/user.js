import Ember from 'ember'
import DS from 'ember-data'

export default DS.Model.extend({
	name: DS.attr('string'),
	collections: DS.hasMany('collection',{inverse: 'user'}),
	withCollections: true,
	role: DS.attr('string'),
	editableTripIds: DS.attr(),
	guest: DS.attr('boolean'),

	canEditCollection: function(collection) {
		return (collection && (this.ownsCollection(collection)));
	},

	ownsCollection: function(collection) {
		return (this.get('id') == collection.get('ownerId'));
	},

	isEditor: function() {
		return (["admin", "editor"].indexOf(this.get('role').toLowerCase()) > -1);
	}.property('role')
});


