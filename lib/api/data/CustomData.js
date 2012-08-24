(function() {
	function createColumnBuilder(columns) {
		columns = rsc.util.toArray(columns);

		return function(record) {
			var translated = {};

			columns.forEach(function(column) {
				translated[column] = record[column];
			});
			return translated;
		};
	}

	function aggregate(records, builder) {
		if (!Ext.isFunction(builder)) {
			builder = createColumnBuilder(builder);
		}

		return records.map(builder);
	}

	rsc.api.CustomData = function(records, columnsOrBuilder, sortOn, direction) {
		records = aggregate(records, columnsOrBuilder);

		var config = {
			data: records
		};

		if(sortOn) {
			config.sorters = [{ property: sortOn, direction: (direction || 'ASC')}];
		}

		var customStore = Ext.create('Rally.data.custom.Store', config);

		return customStore;
	};
})();