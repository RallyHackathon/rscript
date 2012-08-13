
rsc.util = {
	toArray: function(arg) {
		if(!arg) {
			return [];
		}
		
		return Ext.isArray(arg) ? arg : [arg];
	},

	stringToHtml: function(str) {
		return Ext.isString(str) ? new rsc.api.Html(str) : str;
	}
};
