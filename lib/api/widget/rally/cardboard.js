
rsc.api.Cardboard = function(types, attribute) {
	if(Ext.isString(types)) {
		types = [types]
	}

	var proxy = new rsc.Proxy(function(container) {
		var config = {
			xtype: 'rallycardboard',
			types: types,
			attribute: attribute || 'ScheduleState'
		};

		if(this.pending.filter) {
			config.storeConfig = {
				filters: [this.pending.filter]
			};
			delete this.pending.filter;
		}

		this.cmp = container.add(config);
	});

	proxy.surfaceMethods('refresh');

	Object.defineProperty(proxy, 'filter', {
		set: function(f) {
			if(this.cmp) {
				this.cmp.refresh({
					storeConfig: {
						filters: [f]
					}
				});
			} else {
				this.pending.filter = f;
			}
		}
	});

	return proxy;
};

