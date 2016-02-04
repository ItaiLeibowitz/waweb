import Ember from 'ember';

export default Ember.Component.extend({
	orientationService: Ember.inject.service('orientation-service'),
	xRot: 50,
	yrot: 50,

	setup: function(){
		var self = this,
			threshold = 0.1,
			lpFactor = 700,
			elementToRotate = this.$().siblings('.image-container')[0];
		window.imageOrientation = {};
		window.imageOrientation.elementToRotate = elementToRotate;
		window.imageOrientation.isPortrait = window.innerHeight > window.innerWidth;
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
			var didChange = false;
			var maxChange = Math.max(Math.abs(window.imageOrientation.previousAlpha - event.originalEvent.alpha),
					Math.abs(window.imageOrientation.previousBeta - event.originalEvent.beta),
					Math.abs(window.imageOrientation.previousGamma - event.originalEvent.gamma));
			if (maxChange > threshold) {
				didChange = true;
				window.imageOrientation.previousAlpha = event.originalEvent.alpha;
				window.imageOrientation.previousBeta = event.originalEvent.beta;
				window.imageOrientation.previousGamma = event.originalEvent.gamma;
				var degrees = self.calcThetaPhi(event.originalEvent.alpha, event.originalEvent.beta, event.originalEvent.gamma),
					theta = degrees[0],
					phi = degrees[1];


				//console.log(theta, phi)
				window.imageOrientation.initialTheta = (((lpFactor - 1) * window.imageOrientation.initialTheta + self.closestAngleDist(window.imageOrientation.initialTheta, theta, 360)[1]) / lpFactor) % 360;
				window.imageOrientation.initialPhi = (((lpFactor - 1) * window.imageOrientation.initialPhi + self.closestAngleDist(window.imageOrientation.initialPhi, phi, 180)[1]) / lpFactor ) % 360;
				var xRot = -Math.max(Math.min(1, self.closestAngleDist(window.imageOrientation.initialTheta, theta, 360)[0] / 100), -1) * 50 + 50;
				var xTranslate = -(xRot - 50) / 100 * 12;
				//console.log('new alpha:', self.closestAngleDist(window.imageOrientation.initialTheta, theta, 360)[1], theta, xRot)
				window.imageOrientation.xRot = xRot;
				var yRot = Math.max(Math.min(1, -self.closestAngleDist(window.imageOrientation.initialPhi, phi, 180)[0] / 30), -1) * 50 + 50;
				var yTranslate = -(yRot - 50) / 100 * 12;
				//console.log('new Beta:', self.closestAngleDist(window.imageOrientation.initialPhi, phi, 180)[0], yRot)
				window.imageOrientation.yRot = yRot;
			}
			if (didChange) {
				window.imageOrientation.elementToRotate.style.backgroundPosition = xRot + "% " + yRot + "%";
				window.imageOrientation.elementToRotate.style.transform = "scale3d(1.3, 1.3, 1) translate3d(" + xTranslate + "%," + yTranslate + "%,0)"
			}
		})
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
		this.setProperties({
			xRot: 50,
			yRot: 50
		})
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