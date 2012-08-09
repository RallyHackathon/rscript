
rsc.stack = function(configOrChild, childrenOrUndefined) {
	var container;
	var children = [];
	var config = {};

	if(configOrChild && configOrChild.isRscPromise) {
		children.push(configOrChild);
		children = Ext.Array.merge(children, childrenOrUndefined || []);
	} else if(configOrChild) {
		config = configOrChild;
		children = childrenOrUndefined || [];
	}

	var promise = new rsc.Promise(function(parentContainer) {
		config = Ext.applyIf({
			xtype: 'container'
		}, config);

		container = parentContainer.add(config);
	});

	return promise;
};

