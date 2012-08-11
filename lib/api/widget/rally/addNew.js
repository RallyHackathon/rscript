
rsc.api.addNew = function(types, ignoredFields) {
	if(Ext.isObject(types)) {
		types = [types];
	}

	if(Ext.isObject(ignoredFields)) {
		ignoredFields = [ignoredFields];
	}

	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'rallyaddnew',
			recordTypes: types,
			ignoredRequiredFields: ignoredFields,
			showAddWithDetails: false
		});
	});

	proxy.defineEventProperties('recordadd', {
		beforerecordadd: function(callback) {
			return function(a, e) {
				callback(new rsc.Record(e.record));
			};
		}
	});

	return proxy;
};


