import Ember from 'ember';

var WithAncestry = Ember.Mixin.create({
	parentName: function() {
		var names = this.get('ancestryNames');
		if (names && names.length > 0) {
			names = names.split("/");
			return names[names.length - 1];
		} else {
			return false
		}
	}.property('ancestryNames'),

	parentId: function() {
		var ancestry = this.get('ancestry');
		if (ancestry && ancestry.length > 0) {
			var ancestryArray = ancestry.split("/");
			return ancestryArray[ancestryArray.length - 1];
		} else {
			return false
		}
	}.property('ancestry'),


	parentSlug: function() {
		return this._createSlug(this.get('parentId'), this.get('parentName'));
	}.property('parentId', 'parentName'),

	ancestorsArray: function(){
		var ancestry = this.get('ancestry'),
			ancestryNames = this.get('ancestryNames'),
			response = [];
		if (ancestry && ancestry.length > 0) {
			var ancestryArray = ancestry.split("/"),
				ancestryNamesArray = ancestryNames.split("/");
			response = ancestryArray.map(function(el, i){
				return {name: ancestryNamesArray[i], slug: `${el}-${ancestryNamesArray[i]}`,offsetClass: `offset-${i}`}
			});
		}
		response.push({name: this.get('name'), slug: this.get('slug'), offsetClass:`offset-${response.length} is-selected`});
		return response;
	}.property('ancestry','ancestryNames','name','slug'),

	_createSlug: function(id, name) {
		if (id && name) {
			return [id.toString(), name.toLowerCase()].join(' ').replace(/ /g, '-');
		} else {
			return "no parent"
		}

	},

	parentOption: function(key, value, previousValue) {
		if (arguments.length > 1) {
			this.set('ancestry', value.ancestry);
			this.set('ancestryNames', value.ancestryNames);
			return value;
		} else {
			return {name: this.get('parentName'), id: this.get('parentId')};
		}
	}.property('parentId','parentName'),

	parentOptions: function(){
		// for each child item, get its ancestry - any of those would be parent options for the collection/trip
		var parentOptions = [
				{
					id: null,
					name: "No parent",
					ancestry: null,
					ancestryNames: null
				}
			],
			parentCount = {};

		this.get('items').forEach(function(child){

			var ancestry = child.get('ancestry'),
				ancestryNames = child.get('ancestryNames'),
				ancestryArray = ancestry ? ancestry.split("/") : [],
				ancestryNamesArray = ancestryNames ? ancestryNames.split("/") : [];

			for (var i = 0; i < ancestryArray.length; i++) {
				if (!parentCount[ancestryArray[i]]) {
					parentOptions.push({
						id: ancestryArray[i],
						name: ancestryNamesArray[i],
						ancestry: ancestryArray.slice(0, i + 1).join("/"),
						ancestryNames: ancestryNamesArray.slice(0, i + 1).join("/")
					});
				}
				parentCount[ancestryArray[i]] = parentCount[ancestryArray[i]] + 1 || 1;
			}


		});
		// sort the parent options by likelyhood and ancestry depth
		return parentOptions.sort(function(a,b){
			if (parentCount[a.id] == parentCount[b.id]) {
				return a.ancestry.split("/").length > b.ancestry.split("/").length ? -1 : 1
			} else {
				return parentCount[a.id] > parentCount[b.id] ? -1 : 1;
			}
		});
	}.property('items')

});

export default WithAncestry;