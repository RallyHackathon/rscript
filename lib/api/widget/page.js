
rsc.api.page = function(tag, childrenOrUndefined) {
	if(!Ext.isString(tag)) {
		throw new Error("page() must give the page a tag, ie page('mytag', ....)");
	}

	var children = Ext.Array.toArray(arguments);
	children = Ext.Array.remove(children, tag);

	var proxy = new rsc.Proxy(function(container) {
		var root = container.up('#' + rsc.RootId);

		if(root) {
			this.cmp = root.add({
				xtype: 'container',
				width: '100%',
				height: '100%',
				itemId: tag
			});

			Ext.Array.each(children, function(child) {
				child = rsc.util.stringToHtml(child);
				child.resolve(this.cmp);
			}, this);
		}

	});

	Object.defineProperty(proxy, 'tag', {
		writable: false,
		enumerable: true,
		configurable: false,
		value: tag
	});

	proxy.add = function(proxy) {
		if(Ext.isString(proxy)) {
			proxy = rsc.api.html(proxy);
		}
		if(this.cmp) {
			proxy.resolve(this.cmp);
		} else {
			children.push(proxy);
		}
	}

	return proxy;
};

rsc.api.goToPage = function(tag) {
	var root = rsc.__root__;

	if(root) {
		root.setToPage(tag);
	} else {
		rsc.api.launch.initialTag = tag;
	}
};

