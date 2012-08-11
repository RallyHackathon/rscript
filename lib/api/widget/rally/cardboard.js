
rsc.api.cardboard = function(type, attribute) {
	var promise = new rsc.Promise(function(container) {
		var config = {
			xtype: 'rallycardboard',
			types: [type],
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

	return promise;
};

