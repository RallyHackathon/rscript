
rsc.api.stack = function(configOrChild, varargs) {
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

		this.cmp = parentContainer.add(config);

		Ext.Array.each(children, function(child) {
			child.resolve(this.cmp);
		}, this);
	});

	promise.add = function(promise) {
		if(!this.cmp) {
			children.push(promise);
		} else {
			promise.resolve(this.cmp);
		}
	};

	return promise;
};

