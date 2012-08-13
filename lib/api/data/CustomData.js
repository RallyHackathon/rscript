rsc.api.CustomData = function(records, columnsOrBuilder, orderBy) {
	
	function createColumnBuilder(columns) {
		return function(record) {
			var translated = {};

			columns.forEach(function(column) {
				translated[column] = record[column];
			});
			return translated;
		};
	}

	function aggregate(records, builder) {
		if(!Ext.isFunction(builder)) {
			builder = createColumnBuilder(builder);
		}

		return records.map(builder);
	}

	records = aggregate(records, columnsOrBuilder);

	var customStore = Ext.create('Rally.data.custom.Store', {
		data: records
	});

	Object.defineProperty(customStore, 'records', {
		writable: false,
		configurable: false,
		enumerable: true,
		value: records
	});

	return customStore;
};
