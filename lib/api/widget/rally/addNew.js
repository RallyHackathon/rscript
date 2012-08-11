
rsc.api.addNew = function(types, varargs_ignoredFields) {
	var ignored = Ext.Array.toArray(arguments);
	ignored = Ext.Array.remove(ignored, types);

	if(Ext.isObject(types)) {
		types = [types];
	}

	var promise = new rsc.Promise(function(container) {
		this.cmp = container.add({
			xtype: 'rallyaddnew',
			recordTypes: types,
			ignoredRequiredFields: ignored,
			showAddWithDetails: false
		});
	});

	promise.defineEventProperties('beforerecordadd', 'recordadd');

	return promise;
};


