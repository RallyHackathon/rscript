rsc.api.CurrentUser = function() {
	var user = Ext.clone(Rally.environment.getContext().getUser());

	var proxy = rsc.api.Html('&nbsp;' + user._refObjectName + '&nbsp;');

	Ext.Object.each(user, function(key, value) {
		if (!Ext.isFunction(value)) {
			Object.defineProperty(proxy, key, {
				writable: false,
				enumerable: true,
				configurable: false,
				value: value
			});
		}
	});

	return proxy;
};