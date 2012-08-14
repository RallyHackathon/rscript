
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

		// not the best implementation, but it works

		str = str.replace(/([A-Z])/g, ' $1');

		// convert things like "I D" back to "ID"
		str = str.replace(/([A-Z])\s([A-Z])/g, '$1$2');

		return Ext.String.trim(Ext.String.capitalize(str));
	}
};
