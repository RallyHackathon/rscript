
rsc.stack = function(configOrChild, varargs) {
	var container;
	var children = Ext.Array.toArray(arguments);
	var config = {};

	if(configOrChild && !configOrChild.isRscPromise) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	}

	var promise = new rsc.Promise(function(parentContainer) {
		config = Ext.applyIf({
			xtype: 'container'
		}, config);

		container = parentContainer.add(config);

		Ext.Array.each(children, function(child) {
			child.resolve(container);
		});
	});

	return promise;
};

