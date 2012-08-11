
rsc.api.iterationCombobox = function() {
	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'rallyiterationcombobox'
		});
	});

	proxy.defineEventProperties('ready', 'change');

	proxy.surfaceMethodsAsProperties({
		getDisplayValue: 'value',
		getValue: 'ref',
		getQueryFromSelected: 'filter'
	});

	return proxy;
};
