import DS from 'ember-data';

export default DS.Store.extend({

	_clearArrayOfPartials: function (data) {
		var self = this;
		return data.filter(function (el) {
			if (el.attributes && el.attributes.partial) {
				var peekedRecord = self.peekRecord(el.type, el.id);
				if (peekedRecord && !peekedRecord.get('partial')) {
					return false;
				}
			}
			return true;
		});
	},

	push: function(data){
		// Look through both data.data and data.included and remove elements where
		// the element is Partial and there is a non-partial record in the store already
		if (data.data && data.data.length>0) {
			data.data = this._clearArrayOfPartials(data.data)
		}
		if (data.data && data.data.attributes && data.data.attributes.partial){
			var peekedRecord = this.peekRecord(data.data.type, data.data.id);
			if (peekedRecord && !peekedRecord.get('partial')){
				data.data.attributes.partial = false;
			}
		}
		if (data.included && data.included.length>0) {
			data.included = this._clearArrayOfPartials(data.included)
		}
	  return this._super(data)
	}
});