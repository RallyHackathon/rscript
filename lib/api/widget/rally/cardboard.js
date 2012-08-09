
rsc.api.cardboard = function(type, attribute) {
	var cardboard;

	var promise = new rsc.Promise(function(container) {
		var config = {
			xtype: 'rallycardboard',
			types: [type],
			attribute: attribute
		};

		if(promise.pending.filter) {
			config.storeConfig = {
				filters: [promise.pending.filter]
			};
			delete promise.pending.filter;
		}

		cardboard = container.add(config);
	});

	promise.pending = {};

	Object.defineProperty(promise, 'filter', {
		set: function(f) {
			if(cardboard) {
				cardboard.refresh({
					storeConfig: {
						filters: [f]
					}
				});
			} else {
				promise.pending.filter = f;
			}
		}
	});

	return promise;
};

