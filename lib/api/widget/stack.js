
rsc.api.stack = function(configOrChild, varargs) {
	var children = Ext.Array.toArray(arguments);
	var config = {};

	if(configOrChild && !configOrChild.isRscProxy && !Ext.isString(configOrChild)) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	}

	var proxy = new rsc.Proxy(function(parentContainer) {
		config = Ext.applyIf({
			xtype: 'container'
		}, config);

		this.cmp = parentContainer.add(config);

		Ext.Array.each(children, function(child) {
			child = rsc.util.stringToHtml(child);
			child.resolve(this.cmp);
		}, this);
	});

	proxy.add = function(proxy) {
		if(Ext.isString(proxy)) {
			proxy = rsc.api.html(proxy);
		}
		
		if(!this.cmp) {
			children.push(proxy);
		} else {
			proxy.resolve(this.cmp);
		}
	};

	return proxy;
};

