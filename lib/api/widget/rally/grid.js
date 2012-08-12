
rsc.api.grid = function(artifactType, columns, filter) {
	
	var proxy = new rsc.Proxy(function(container) {
		var placeHolder = container.add({
			xtype: 'container'
		});
	
		Rally.data.ModelFactory.getModel({
			type: artifactType || 'UserStory',
			success: function(model) {
				var config = {
					xtype: 'rallygrid',
					model: model
				};

				if(Ext.isArray(filter)) {
					config.storeConfig = {
						filters: filter
					};
				} else if(Ext.isObject(filter)) {
					config.storeConfig = {
						filters: [filter]
					};
				}

				if(columns) {
					config.columnCfgs = columns;
					config.autoAddAllModelFieldsAsColumns = false;
				} else {
					config.autoAddAllModelFieldsAsColumns = true;
				}

				this.cmp = placeHolder.add(config);
			},
			scope: this
		});
	});

	return proxy;
};

