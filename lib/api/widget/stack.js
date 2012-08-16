rsc.api.Stack = function(configOrChild, varargs) {
	var children = Ext.Array.toArray(arguments);
	var config = {};

	if (configOrChild && !configOrChild.isRscProxy && !Ext.isString(configOrChild)) {
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

		this.loadMask = this.pending.loadMask;
		delete this.pending.loadMask;
	});

	proxy.add = function(varargs) {
		var proxies = Ext.Array.toArray(arguments);

		Ext.Array.each(proxies, function(proxy) {
			proxy = rsc.util.stringToHtml(proxy);

			if (this.cmp) {
				proxy.resolve(this.cmp);
			}
			
			children.push(proxy);

		}, this);
	};

	proxy.remove = function(varargs) {
		var proxies = Ext.Array.toArray(arguments);

		Ext.Array.each(proxies, function(proxy) {
			if (this.cmp) {
				this.cmp.remove(proxy.cmp);
			} 
			
			children = Ext.Array.remove(children, proxy);
		}, this);
	};

	proxy.each = function(callback) {
		Ext.Array.each(children, callback);
	};

	return proxy;
};