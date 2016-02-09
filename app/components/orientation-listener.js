import Ember from 'ember';

export default Ember.Component.extend({
	orientationService: Ember.inject.service('orientation-service'),

	parentViewMeasurementsDidChange: function(){
		Ember.run.scheduleOnce('render', this, 'updateOrientationDeltas');
	}.observes('parentView.width', 'parentView.height', 'parentView.outerWidth', 'parentView.outerHeight').on('init'),

	updateOrientationDeltas: function(){
		if (this.get('parentView')) {   // to prevent updating the deltas when this is removed then parentView = null
			window.imageOrientation = window.imageOrientation || {};
			window.imageOrientation.deltaX = this.get('parentView.width') - this.get('parentView.outerWidth');
			window.imageOrientation.deltaY = this.get('parentView.height') - this.get('parentView.outerHeight');
		}
	},

	setup: function(){
		var self = this,
			elementToRotate = this.$().siblings('.background-image-holder')[0];
		window.imageOrientation = {};
		window.imageOrientation.elementToRotate = elementToRotate;
		window.imageOrientation.isPortrait = window.innerHeight > window.innerWidth;
		window.imageOrientation.calcThetaPhi = this.calcThetaPhi;
		window.imageOrientation.closestAngleDist = this.closestAngleDist;
		window.imageOrientation.updateImage = this.updateImage;

		// Initialize on the first alpha event
		$(window).one('deviceorientation.orientationListenerFirst', function(event){
			var degrees = self.calcThetaPhi(event.originalEvent.alpha, event.originalEvent.beta, event.originalEvent.gamma),
				theta = degrees[0],
				phi = degrees[1];
			window.imageOrientation.initialTheta = theta;
			window.imageOrientation.initialPhi = phi;
			window.imageOrientation.previousAlpha = event.originalEvent.alpha;
			window.imageOrientation.previousBeta = event.originalEvent.beta;
			window.imageOrientation.previousGamma = event.originalEvent.gamma;

		});
		$(window).off('deviceorientation.orientationListener').on('deviceorientation.orientationListener', function (event) {
			window.imageOrientation.previousAlpha = event.originalEvent.alpha;
			window.imageOrientation.previousBeta = event.originalEvent.beta;
			window.imageOrientation.previousGamma = event.originalEvent.gamma;
			if (window.imageOrientation.scheduledAnimationFrame) return;

			window.imageOrientation.scheduledAnimationFrame = true;
			requestAnimationFrame(self.calcAngles)

		})
	},

	calcAngles: function(){
		var degrees = window.imageOrientation.calcThetaPhi(window.imageOrientation.previousAlpha, window.imageOrientation.previousBeta, window.imageOrientation.previousGamma),
			theta = degrees[0],
			phi = degrees[1];
		var lpFactor = 700;
		var correctedTheta = window.imageOrientation.closestAngleDist(window.imageOrientation.initialTheta, theta, 360);
		var correctedPhi = window.imageOrientation.closestAngleDist(window.imageOrientation.initialPhi, phi, 180);
		window.imageOrientation.initialTheta = (((lpFactor - 1) * window.imageOrientation.initialTheta + correctedTheta[1]) / lpFactor) % 360;
		window.imageOrientation.initialPhi = (((lpFactor - 1) * window.imageOrientation.initialPhi + correctedPhi[1]) / lpFactor ) % 360;
		var xRot = -Math.max(Math.min(1, correctedTheta[0] / 40), -1) * 50 + 50;
		var xTranslate = - (xRot) / 100 * window.imageOrientation.deltaX;
		window.imageOrientation.xRot = xRot;
		window.imageOrientation.xTranslate = xTranslate;
		var yRot = Math.max(Math.min(1, -correctedPhi[0] / 30), -1) * 50 + 50;
		var yTranslate = -(yRot) / 100 * window.imageOrientation.deltaY;
		window.imageOrientation.yRot = yRot;
		window.imageOrientation.yTranslate = yTranslate;
		window.imageOrientation.updateImage();
	},

	updateImage: function(){
		if (window.imageOrientation.elementToRotate) {
			window.imageOrientation.elementToRotate.style.transform = "translate3d(" + window.imageOrientation.xTranslate + "px," + window.imageOrientation.yTranslate + "px,0)"
		}
		window.imageOrientation.scheduledAnimationFrame = null;
	},

	calcThetaPhi: function(alpha, beta, gamma){
		// calcs based on the spec found here: http://w3c.github.io/deviceorientation/spec-source-orientation.html
		var degToRad = Math.PI / 180;
		alpha = alpha * degToRad;
		beta = beta * degToRad;
		gamma = gamma * degToRad;
		var cosA = Math.cos(alpha),
			sinA = Math.sin(alpha),
			cosB = Math.cos(beta),
			sinB = Math.sin(beta),
			cosC = Math.cos(gamma),
			sinC = Math.sin(gamma),
			vX = -cosA * sinC - sinA * sinB * cosC,
			vY = cosA*sinB*cosC-sinA*sinC,
			vZ = -cosB * cosC;
		var theta = Math.atan(vX / vY),
			phi = Math.acos(vZ);

		// Convert theta to use whole unit circle
		if( vY < 0 ) {
			theta += Math.PI;
		} else if( vX < 0 ) {
			theta += 2 * Math.PI;
		}

		theta = theta / degToRad;
		phi = phi / degToRad;
		return [theta, phi]
	},

	closestAngleDist: function (initialAngle, currentAngle, correctionAngle) {
		var addAngles = [-1 * correctionAngle, 0, correctionAngle],
			dist = Array(3),
			minAbsDist = 720,
			minIndex = 1;

		for (var i = 0; i < addAngles.length; i++) {
			dist[i] = initialAngle - (currentAngle + addAngles[i]);
			var absDist = Math.abs(dist[i]);
			if (absDist < minAbsDist) {
				minAbsDist = absDist;
				minIndex = i;
			}
		}
		return [dist[minIndex], currentAngle + addAngles[minIndex]];
	},



	unsetup: function(){
		$(window).off('.orientationListener');
		window.imageOrientation.elementToRotate.style.transform = "translate3d(" + (- window.imageOrientation.deltaX / 2) + "px," +  (- window.imageOrientation.deltaY / 2) + "px,0)"
	},



	didInsertElement: function(){
		this._super();
		this.setup();
		this.set('orientationService.component', this);
	},

	willDestroyElement: function(){
		this.unsetup();
		this._super();
	}

});