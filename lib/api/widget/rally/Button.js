rsc.api.Button = function(text) {
	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'rallybutton',
			text: text
		});
	});

	proxy.defineEventProperties({
		click: function(callback) {
			return function(extButton) {
				callback(proxy);
			};
		}
	});

	return proxy;
};

