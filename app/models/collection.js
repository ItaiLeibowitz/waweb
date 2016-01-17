import Ember from 'ember';
import DS from 'ember-data';
import WithItemImage from 'waweb/mixins/with_item_image'
import WithAncestry from 'waweb/mixins/with_ancestry'
import ModelWithDescs from 'waweb/mixins/model_with_descs'
import Constants from 'waweb/appconfig/constants'

export default DS.Model.extend(ModelWithDescs, WithItemImage, WithAncestry, {
	name: DS.attr('string'),
	items: DS.hasMany('item', {inverse: 'collection'}),
	user: DS.belongsTo('user', {inverse: 'collections'}),
	ownerId: DS.attr('string'),
	// hint: based on partial loading from here:http://watsonbox.github.io/blog/2014/06/13/lazy-and-partial-data-loading-with-ember-dot-js-and-rails/
	partial: DS.attr('boolean'),
	featured: DS.attr('boolean'),
	ancestry: DS.attr('string'),
	ancestryDepth: DS.attr('number'),
	ancestryNames: DS.attr('string'),
	parent: DS.belongsTo('item'),
	topItemsRank: 9999,
	itemTypeName: "Collection",
	bookmarkings: DS.hasMany('bookmarking', {inverse: 'collection'}),

	hasAncestry: Ember.computed.notEmpty('ancestry'),
	isEditorial: Ember.computed.or('hasAncestry', 'featured'),

	allItems: Ember.computed.alias('items'),
	destinationRoute: 'collection',
	WAObjectType: 'collection',

	slug: function() {
		return [this.get('id').toString(), this.get('name').toLowerCase()].join(' ').replace(/ /g, '-');
	}.property('id', 'name'),

	// == Images
	firstItem: Ember.computed.alias('items.firstObject'),
	imageProvider: Ember.computed.alias('firstItem.imageProvider'),
	imageUrl: Ember.computed.alias('itemArrayImageUrl'),
	imageStyle: Ember.computed.alias('itemArrayImageStyle'),

	// == Share properties
	shareUrl: function() {
		return [WA.constants.WanderantBaseUrl, '/collections/', this.get('slug')].join("");
	}.property('slug'),

	embedUrl: function(){
		return '<div style="text-align: right;"><iframe width="800" height="600" src="https://www.wanderant.com/map?c=%@" frameborder="0" style="display: block;"></iframe><a href="https://www.wanderant.com/collections/%@" style="text-decoration: none; display: block; font-size: 0.9em; line-height: 2em;">See the collection: %@ - on Wanderant</a></div>'
			.fmt(this.get('id'), this.get('slug'), this.get('name'));
	}.property('slug'),

	shareDescription: "Check out this collection on Wanderant!",

	shareError: function() {
		return (this.get('firstItem') ? null : 4);
	}.property('firstItem'),

	relativeUrl: function() {
		return '/#' + WA.Router.router.generate('collection', this);
	}.property('id'),

	isHiddenRank: function(){
		return this.get('isHidden') ? 1 : 0
	}.property('isHidden')

});