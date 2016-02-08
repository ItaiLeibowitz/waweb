import Ember from 'ember';

export default Ember.Component.extend({
	height: null,
	width: null,

	setupDimensions: function () {
		var stretchFactor = 1.2;
		var container = this.$().parents('.image-container'),
			outerHeight = container.height(),
			outerWidth = container.width(),
			innerHeight = this.$('img').height(),
			innerWidth = this.$('img').width();
		var H2W = outerHeight / outerWidth,
			h2w = innerHeight / innerWidth;
		if (h2w <= H2W) {
			var height = outerHeight * stretchFactor,
				width = innerWidth * outerHeight / innerHeight * stretchFactor;
		} else {
			var width = outerWidth * stretchFactor,
				height = innerHeight * outerWidth / innerWidth * stretchFactor;
		}
		this.setProperties({
			height: height,
			width: width,
			outerHeight: outerHeight,
			outerWidth: outerWidth,
			innerHeight: innerHeight,
			innerWidth: innerWidth,
			initialStyle:"transform: translate3d(" + ( (outerWidth - width) / 2) + "px," +  ((outerHeight-height) / 2) + "px,0)"

		})
	},

	setupOrientationChangeListener: function(){
		var self = this;
		$(window).off('resize.imageHolder').on('resize.imageHolder', function (event) {
			Ember.run.scheduleOnce('afterRender', self, 'setupDimensions');
		});
	},


	didInsertElement: function () {
		this._super();
		Ember.run.scheduleOnce('afterRender', this, 'setupDimensions');
		this.setupOrientationChangeListener();
	},

	willDestroyElement: function(){
		$(window).off('.imageHolder');
		this._super()
	}

});