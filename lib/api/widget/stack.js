rsc.api.Stack = function(configOrChild, varargs) {
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

		this.loadMask = this.pending.loadMask;
		delete this.pending.loadMask;
	});

	proxy.add = function(proxy) {
		proxy = rsc.util.stringToHtml(proxy);
		
		if(!this.cmp) {
			children.push(proxy);
		} else {
			proxy.resolve(this.cmp);
		}
	};

	Object.defineProperty(proxy, 'loadMask', {
		set: function(value) {
			if(this.cmp) {
				if(value) {
					this.cmp.getEl().mask('Loading...');
				} else {
					this.cmp.getEl().unmask();
				}
			} else {
				this.pending.loadMask = value;
			}
		}
	});

	return proxy;
};

