
rsc.api.addNew = function(types, varargs_ignoredFields) {
	var addNew;
	var ignored = Ext.Array.toArray(arguments);
	ignored = Ext.Array.remove(ignored, types);

	if(Ext.isObject(types)) {
		types = [types];
	}

	var promise = new rsc.Promise(function(container) {
		addNew = container.add({
			xtype: 'rallyaddnew',
			recordTypes: types,
			ignoredRequiredFields: ignored,
			showAddWithDetails: false
		});

		Ext.Object.each(promise.pending, function(key, value) {
			addNew.on(key, value);
		});
		promise.pending = {};
	});

	promise.pending = {};

	Object.defineProperty(promise, 'beforerecordadd', {
		set: function(callback) {
			if(addNew) {
				addNew.on('beforerecordadd', callback);
			} else {
				this.pending.beforerecordadd = callback;
			}
		}
	});

	Object.defineProperty(promise, 'recordadd', {
		set: function(callback) {
			if(addNew) {
				addNew.on('recordadd', callback);
			} else {
				this.pending.recordadd = callback;
			}
		}
	});

	return promise;
};


