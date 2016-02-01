import ApplicationAdapter from 'waweb/adapters/application';

export default ApplicationAdapter.extend({
	shouldBackgroundReloadRecord: function(){
		return false;
	},
	shouldBackgroundReloadAll: function(){
		return false;
	}
});