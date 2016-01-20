import Ember from 'ember'

var runExtensions = {};

runExtensions._checkCondition = function (target, condition, resolve, reject, currentTime, maxTime, timeStep) {
	switch (typeof(condition)) {
		case "boolean":
			if (condition) return resolve();
			break;
		case "function":
			if (condition()) return resolve(condition());
			break;
		case "string":
			if (target.get(condition)) return resolve(target.get(condition));
			break;
		default:
			reject('Unknown condition type: ' + typeof(condition));
	}

	if (currentTime >= maxTime) {
		return reject('Time limit reached: ' + maxTime.toString());
	} else {
		Ember.run.later(this, '_checkCondition', target, condition, resolve, reject, currentTime + timeStep, maxTime, timeStep, timeStep);
	}
};

runExtensions.waitUntil = function (target, condition, options) {
	// Executes a condition every timeStep milliseconds until either the condition is true or maxTime is reached
	// Condition can be either a boolean, a function, or a string representing a property
	// Options can include:
	// timeStep (in ms, default is 200)
	// maxTime (in ms, default is 5000)
	options = options || {};
	var currentTime = 0;
	var timeStep = options.timeStep || 200;
	var maxTime = options.maxTime || 5000;

	return new Ember.RSVP.Promise(function (resolve, reject) {
		runExtensions._checkCondition(target, condition, resolve, reject, currentTime, maxTime, timeStep);
	});
};


export default runExtensions;
