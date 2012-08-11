
rsc.api.cardboard = function(types, attribute) {
	if(Ext.isObject(types)) {
		types = [types]
	}

	var promise = new rsc.Promise(function(container) {
		var config = {
			xtype: 'rallycardboard',
			types: types,
			attribute: attribute
		};

		if(this.pending.filter) {
			config.storeConfig = {
				filters: [this.pending.filter]
			};
			delete this.pending.filter;
		}

		this.cmp = container.add(config);
	});

	Object.defineProperty(promise, 'filter', {
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

	promise.refresh = function() {
		this.cmp && this.cmp.refresh();
	};

	return promise;
};

