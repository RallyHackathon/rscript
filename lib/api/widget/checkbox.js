
rsc.api.checkbox = function(label, checked) {
	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'checkbox',
			boxLabel: label || '',
			checked: !!checked
		});
	});

	proxy.defineEventProperties({
		change: function(callback) {
			return function(checkbox, value) {
				callback(value);
			}
		}
	});

	return proxy;
};
