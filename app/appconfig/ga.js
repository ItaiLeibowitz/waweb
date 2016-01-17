
var GA = {};

GA.gaSend = function() {
	var args = arguments;
	WA.waitUntil(null, function(){ return typeof(ga) === "function"})
		.then(function(){
			ga.apply(null, args);
		})
};
export default GA;
