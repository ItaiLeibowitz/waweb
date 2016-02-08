import Ember from 'ember';

export default Ember.Service.extend({
	ads: function() {
		var adObjects = [
			Ember.Object.create({item: {
				name: "Sheraton Hotel",
				itemType: 1803,
				largeImageStyle: "background-image: url('http://assets.sheratonnewyork.com/responsive/2048/4cdd67876a51efd85430-b1a736a5abe0447d9dfaaa93aeeae3a9.r89.cf1.rackcdn.com/responsive/21:9/4cdd67876a51efd85430-b1a736a5abe0447d9dfaaa93aeeae3a9.r89.cf1.rackcdn.com/lps/assets/u/she421wn.140853_tb-2.jpg')",
				largeImageUrl: "http://assets.sheratonnewyork.com/responsive/2048/4cdd67876a51efd85430-b1a736a5abe0447d9dfaaa93aeeae3a9.r89.cf1.rackcdn.com/responsive/21:9/4cdd67876a51efd85430-b1a736a5abe0447d9dfaaa93aeeae3a9.r89.cf1.rackcdn.com/lps/assets/u/she421wn.140853_tb-2.jpg",
				latitude: 40.747979,
				longitude:  -73.993099,
				boundSwLat: 40.6,
				boundSwLng: -74,
				boundNeLat: 40.8,
				boundNeLng: -73.8,
				longDesc: "<b>TAKE A BITE OF THE BIG APPLE</b> <p>A $180 million renovation has reinvigorated the Sheraton New York Times Square Hotel, between Central Park and Times Square in the Midtown business and entertainment district. Go from a crucial meeting to a famous uptown eatery without missing a beat.</p>"
			}, isAd: true, isExpanded: false}),
			Ember.Object.create({item: {
				name: "Chez Janou",
				itemType: 1803,
				largeImageStyle: "background-image: url('http://orig11.deviantart.net/d005/f/2012/039/c/6/salad__take_two__fancy_restaurant_style_by_courey-d4p25vj.jpg')",
				largeImageUrl: "http://orig11.deviantart.net/d005/f/2012/039/c/6/salad__take_two__fancy_restaurant_style_by_courey-d4p25vj.jpg",
				latitude: 40.847979,
				longitude:  -73.893099,
				boundSwLat: 40.75,
				boundSwLng: -73.9,
				boundNeLat: 40.9,
				boundNeLng: -73.8,
				longDesc: "<b>Home made French cuisine</b> <p>A Michelin-winning restaurateur, Chef Alain Janou delivers innovative dishes inspired by traditional Lyonnaise cuisine. Ingredients are locally farmed and organic, and the daily changing menus range from hearty meat stews to flavorful local seafood. The somewhat limited winelist is wonderfully hand-picked and imported from the Cotes du Rhone. Desserts are a must, especially if you can wait the 20 minutes for the Chartreuse Souffle. </p>"
			}, isAd: true, isExpanded: false}),
			Ember.Object.create({item: {
				name: "Buddha Bar",
				itemType: 1803,
				largeImageStyle: "background-image: url('http://d2cd7s18nw3zcy.cloudfront.net/files/hotel/buddha-bar-hotel-budapest-klotild-palace/BBWorld/BB_Duba%C3%AF_03.jpg')",
				largeImageUrl: "http://d2cd7s18nw3zcy.cloudfront.net/files/hotel/buddha-bar-hotel-budapest-klotild-palace/BBWorld/BB_Duba%C3%AF_03.jpg",
				latitude: 40.747979,
				longitude: -73.793099,
				boundSwLat: 40.7,
				boundSwLng: -73.8,
				boundNeLat: 40.8,
				boundNeLng: -73.7,
				longDesc: "<b>Cocktails with an oriental twist</b> <p>Beyond the appealing decor, the cocktail list is the real draw in this 20's-inspired mega-bar. The talented barkeeps mix up traditional mainstays with a touch of modern asian style. A Martini is served neat with a 5-spices oil mixture and a twist of Calamansi, and the Dark and Stormy in Hanoi gets a dash of orange spiced coffee bitters. Reservations recommended.</p>"
			}, isAd: true, isExpanded: false}),
			Ember.Object.create({item: {
				name: "Ornithological and Marine Park",
				itemType: 1803,
				largeImageStyle: "background-image: url('http://www.abc.net.au/reslib/201003/r532692_3041085.jpg')",
				largeImageUrl: "http://www.abc.net.au/reslib/201003/r532692_3041085.jpg",
				latitude: 40.747979,
				longitude: -73.793099,
				boundSwLat: 40.7,
				boundSwLng: -73.8,
				boundNeLat: 40.8,
				boundNeLng: -73.7,
				longDesc: "<b>A wonderful way to spend an afternoon with your kids</b> <p>Just an hour out of town, this delightful 4-hectare park highlights the country's varied wildlife. From the migration of the spotted starlights to the corals of the nearby shores, the interactive exhibits are entertaining and informative. Open year-round.</p>"
			}, isAd: true, isExpanded: false}),
			Ember.Object.create({item: {
				name: "Torture Museum",
				itemType: 1803,
				largeImageStyle: "background-image: url('http://different-doors.com/wp-content/uploads/2015/08/Museum-Torture-Guillotine.jpg')",
				largeImageUrl: "http://different-doors.com/wp-content/uploads/2015/08/Museum-Torture-Guillotine.jpg",
				latitude: 40.747979,
				longitude: -73.793099,
				boundSwLat: 40.7,
				boundSwLng: -73.8,
				boundNeLat: 40.8,
				boundNeLng: -73.7,
				longDesc: "<b>A curious collection of macabre medieval intruments</b> <p>For a different look at the city's history, check out this small museum. Exhibits range from varied contraptions used in the inquisition to written edicts and letters by its officers condemning the unfaithful and releasing their captors from any punishment. Not for the faint of heart!</p>"
			}, isAd: true, isExpanded: false})
			];

		adObjects.forEach(function(obj){
			obj.setProperties({
				minimize: function() {
					this.set('isExpanded', false);
				}
			})
		});
		return adObjects
	}.property()
});