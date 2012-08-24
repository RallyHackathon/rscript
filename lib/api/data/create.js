
rsc.api.create = function(type, data, callback) {
	Rally.data.ModelFactory.getModel({
		type: type,
		success: function(model) {
			var record = new model(data);
			record.save({ callback: function(record) {
				callback(rsc.Record.wrap(record));
			} });
		}
	});
};

