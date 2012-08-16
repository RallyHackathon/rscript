
rsc.api.AttributeCombobox = function(type, attribute) {
	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'rallyattributecombobox',
			model: type,
			field: attribute
		});
	});

	return proxy;
};

