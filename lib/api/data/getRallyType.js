
rsc.api.getRallyType = function(typeName, callback) {
	Rally.data.ModelFactory.getModel({
		type: typeName,
		success: function(model) {
			callback(rsc.Record.wrapModel(model));
		}
	})
};
