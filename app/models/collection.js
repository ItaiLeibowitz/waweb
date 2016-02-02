import Ember from 'ember';
import DS from 'ember-data';
import WithItemImage from 'waweb/mixins/with_item_image';
import WithAncestry from 'waweb/mixins/with_ancestry';
import ModelWithDescs from 'waweb/mixins/model_with_descs';
import Constants from 'waweb/appconfig/constants';
import promiseFromAjax from 'waweb/mixins/promise_from_ajax';


export default DS.Model.extend(ModelWithDescs, WithItemImage, WithAncestry, {
	mapService: Ember.inject.service('map-service'),
	feedbackService: Ember.inject.service('feedback-service'),
	name: DS.attr('string'),
	items: DS.hasMany('item', {inverse: 'collection', async: false}),
	firstItem: DS.belongsTo('item', {inverse: 'collection'}),
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

	firstItemCalc: function(){
		return this.get('partial') ? this.get('firstItem') : this.get('items.firstObject')
	}.property('firstItem', 'partial', 'items'),

	// == Images
	imageProvider: Ember.computed.alias('firstItemCalc.imageProvider'),
	imageUrl: Ember.computed.alias('itemArrayImageUrl'),
	imageStyle: Ember.computed.alias('itemArrayImageStyle'),


	latitude: Ember.computed.alias('firstItemCalc.latitude'),
	longitude: Ember.computed.alias('firstItemCalc.longitude'),


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
	}.property('isHidden'),

	removeItem: function (item) {
		var collection = this;
		return promiseFromAjax({
			url: '/api/ember2/collections/' + collection.get('id') + '/remove_item/',
			type: 'POST',
			data: { item_id: item.get('id')},
			dataType: 'html'
		}).then(function (response) {
			collection.get('items').removeObject(item);
			collection.get('feedbackService').setProperties({
				isShowing: true,
				feedbackSentence: item.get('name') + " has been successfully removed from ",
				feedbackLinkRoute: 'collection',
				feedbackLinkTarget: collection.get('slug'),
				feedbackLinkModel: collection,
				feedbackActionName: null,
				feedbackAddedClass: 'success'
			})
		}, function (reason) {
			console.log('something went wrong while removing item')
		});
	},

	addItem: function (item) {
		var collection = this;
		return promiseFromAjax({
			url: '/api/ember2/collections/' + collection.get('id') + '/add_item/',
			type: 'POST',
			data: { item_id: item.get('id'),
				long_desc: item.get('altLongDesc'),
				oneliner: item.get('altOneliner')
			},
			dataType: 'html'
		}).then(function (response) {
			collection.get('items').addObject(item);
			collection.get('feedbackService').setProperties({
				isShowing: true,
				feedbackSentence: item.get('name') + " has been added to ",
				feedbackLinkRoute: 'collection',
				feedbackLinkTarget: collection.get('slug'),
				feedbackLinkModel: collection,
				feedbackActionName: null,
				feedbackAddedClass: 'success'
			})
		}, function (reason) {
			if (reason.status == 409) {
				console.log('conflict!!!')
			} else {
				console.log('something went wrong while removing item')
			}
		});
	}




});