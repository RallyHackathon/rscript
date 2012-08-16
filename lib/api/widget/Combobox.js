(function() {
	function buildStore(values) {
		var data = [];
		if (Ext.isObject(values)) {
			Ext.Object.each(values, function(key, value) {
				data.push({
					name: key,
					value: value
				});
			});
		} else {
			values = rsc.util.toArray(values);
			Ext.Array.each(values, function(value) {
				data.push({
					name: value,
					value: value
				});
			})
		}

		return Ext.create('Ext.data.Store', {
			fields: ['name', 'value'],
			data: data
		});
	}

	rsc.api.Combobox = function(label, values) {
		var proxy = new rsc.Proxy(function(container) {
			this.cmp = container.add({
				xtype: 'combobox',
				queryMode: 'local',
				fieldLabel: label,
				displayField: 'name',
				valueField: 'value',
				store: buildStore(values)
			});
		});

		proxy.defineEventProperties('select');

		proxy.surfaceMethodsAsProperties({
			getDisplayValue: 'value'
		});

		return proxy;
	};
})();