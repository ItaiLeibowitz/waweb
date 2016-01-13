import DS from 'ember-data';

export default DS.Store.extend({

/*
	// use this function to load or push one object
	load: function(type, data, force) {
		return this.push(type, this.normalize(type, data), false, force);
	},

	// use this function to load or push many objects of the same type and return them
	// can have side data in the payload that will be load-or-pushed as well
	// call with force = true to always push (note: side data cannot be forced)
	loadMany: function(type, payload, force) {
		return this.pushMany(type, this.serializerFor(type).extractArray(this, this.modelFor(type), payload), force);
	},

	// monkey patch in order to allow use of the 'force' param
	pushMany: function(type, datas, force) {
		var length = datas.length;
		var result = new Array(length);

		for (var i = 0; i < length; i++) {
			result[i] = this.push(type, datas[i], false, force);
		}

		return result;
	},

	// the 'partial' argument is true, if the call to .push came from .update
	// it's only used internally and it will be deprecated at some point
	push: function(type, data, partial, force) {
		var storedObject = this.getById(type, data.id);
		// If the record has been marked as deleted, we need to roll it back to be able to push it again.
		if (storedObject && storedObject.get('currentState.stateName') === 'root.deleted.uncommitted') {
			storedObject.rollback();
			force = true;
		}
		if (!force && storedObject && storedObject.get('isLoaded') && !storedObject.get('partial')) {
			if (data.partial) { // if trying to replace a full object with a partial, update it
				delete data.partial;
				delete data.items;
				return this._super(type, data, true);
			} else {
				return storedObject;
			}
		} else {
			return this._super(type, data, partial);
		}
	},

	countItems: function(){
		return this.all('item').content.length;
	}*/

});
