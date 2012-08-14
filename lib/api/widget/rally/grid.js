rsc.api.Grid = function(artifactTypeOrStore, columns, filter) {

	function convertStringColumns(strings) {
		var columns = [];

		strings.forEach(function(str) {
			columns.push({
				text: rsc.util.camelToHuman(str),
				dataIndex: str
			});
		});

		if(columns[0]) {
			columns[0].flex = 1;
		}

		return columns;
	}

	var proxy = new rsc.Proxy(function(container) {

		if (Ext.isString(artifactTypeOrStore)) {
			var artifactType = artifactTypeOrStore;

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

					if (Ext.isArray(filter)) {
						config.storeConfig = {
							filters: filter
						};
					} else if (Ext.isObject(filter)) {
						config.storeConfig = {
							filters: [filter]
						};
					}

					if (columns) {
						config.columnCfgs = columns;
						config.autoAddAllModelFieldsAsColumns = false;
					} else {
						config.autoAddAllModelFieldsAsColumns = true;
					}

					this.cmp = placeHolder.add(config);
				},
				scope: this
			});
		} else {
			var config = {
				xtype: 'rallygrid',
				store: artifactTypeOrStore
			};

			if (Ext.isArray(filter)) {
				config.storeConfig = {
					filters: filter
				};
			} else if (Ext.isObject(filter)) {
				config.storeConfig = {
					filters: [filter]
				};
			}

			if (columns) {
				if(artifactTypeOrStore.$className.indexOf('WsapiDataStore') === -1) {
					columns = convertStringColumns(columns);
				}
				config.columnCfgs = columns;
				config.autoAddAllModelFieldsAsColumns = false;
			} else {
				config.autoAddAllModelFieldsAsColumns = true;
			}

			this.cmp = container.add(config);
		}
	});

	return proxy;
};