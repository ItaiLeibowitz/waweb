import Ember from 'ember';
import promiseFromAjax from 'waweb/mixins/promise_from_ajax';
import RouteWithMap from 'waweb/mixins/route-with-map';
import Constants from 'waweb/appconfig/constants';


export default Ember.Controller.extend(RouteWithMap, {
	currentPage: function(){
		return Math.ceil(this.get('model.length') / Constants.PER_PAGE)
	}.property('model.length'),

	actions: {
		loadMore: function(){
			if (!this.get('isLoadingMore')) {
				var self = this,
					mainItem = this.get('mainItem'),
					store = this.get('store'),
					cacheKey = this.get('cacheKey');
				var page = this.get('currentPage') + 1;
				self.set('isLoadingMore', true);
				promiseFromAjax({
					url: ['/api/ember2/items/', this.get('mainItem.id'), '/', this.get('pathType') || "attractions"].join(""),
					type: 'GET',
					data: { page: page }
				}).then(function (data) {
					var items = new Array(data.data.length);

					for (var i = 0; i < data.data.length; i++) {
						var item = store.push(store.normalize('item', data.data[i]));
						items[i] = item;
					}
					self.get('model').addObjects(items);
					self.get('mapService.markerItems').addObjects(items);
					mainItem.get(cacheKey).addObjects(items);

					if (data.meta) {
						self.set('hasMore', data.meta.more);
						mainItem.set(cacheKey+"More", data.meta.more);
					}
					ga('send', 'event', 'items', 'load more', self.get('mainItem.id'));
					self.set('isLoadingMore', false)
				});
			}
		}
	}
});