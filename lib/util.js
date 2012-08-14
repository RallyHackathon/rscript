
rsc.util = {
	toArray: function(arg) {
		if(!arg) {
			return [];
		}
		
		return Ext.isArray(arg) ? arg : [arg];
	},

	stringToHtml: function(str) {
		return Ext.isString(str) ? new rsc.api.Html(str) : str;
	},

	camelToHuman: function(str) {
		if(!Ext.isString(str)) {
			return str;
		}

		return Ext.String.capitalize(str.replace(/([A-Z])/g, ' $1'));
	}
};
