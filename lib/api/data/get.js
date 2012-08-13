rsc.api.get = function(artifactTypes, pageSize, filter, callback) {
	pageSize = pageSize || 50;

	artifactTypes = rsc.util.toArray(artifactTypes);
	var pendingRequests = artifactTypes.length;
	var retrievedRecords = [];

	function onDataLoaded(store, records, artifactType) {
		var index = artifactTypes.indexOf(artifactType);
		retrievedRecords[index] = rsc.Record.wrap(records);

		--pendingRequests;

		if(pendingRequests === 0) {
			callback.apply(null, retrievedRecords);
		}
	}

	artifactTypes.forEach(function(artifactType) {
		Ext.create('Rally.data.WsapiDataStore', {
			model: artifactType,
			fetch: true,
			autoLoad: true,
			pageSize: pageSize,
			listeners: {
				load: function(store, data) {
					onDataLoaded(store, data, artifactType);
				}
			}
		});
	});
};

