/*
rsc.api.dock = function(varargs) {
	var children = Ext.Array.toArray(arguments);

	var proxy = new rsc.Proxy(function(container) {
		var root = container.up('#' + rsc.RootId);

		if (root) {
			var tempContainer = Ext.widget('container');

			Ext.Array.each(children, function(child) {
				if (Ext.isString(child)) {
					child = rsc.api.html(child);
				}
				child.resolve(tempContainer);
			});
			tempContainer.items.each(function(item) {
				root.addDocked(item);
			});
		}
	});

	return proxy;
};
*/