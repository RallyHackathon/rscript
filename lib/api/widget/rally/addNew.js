
rsc.api.addNew = function(types, ignoredFields) {
	if(Ext.isObject(types)) {
		types = [types];
	}

	if(Ext.isObject(ignoredFields)) {
		ignoredFields = [ignoredFields];
	}

	var promise = new rsc.Promise(function(container) {
		this.cmp = container.add({
			xtype: 'rallyaddnew',
			recordTypes: types,
			ignoredRequiredFields: ignoredFields,
			showAddWithDetails: false
		});
	});

	promise.defineEventProperties('recordadd', {
		beforerecordadd: function(callback) {
			return function(a, e) {
				callback(new rsc.Record(e.record));
			};
		}
	});

	return promise;
};


