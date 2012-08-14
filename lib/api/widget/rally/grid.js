(function() {

	function convertStringColumns(strings) {
		var columns = [];

		strings.forEach(function(str) {
			columns.push({
				text: rsc.util.camelToHuman(str),
				dataIndex: str
			});
		});

		if (columns[0]) {
			columns[0].flex = 1;
		}

		return columns;
	}

	function addGridTo(container, columns, filter, configOverrides) {
		var config = {
			xtype: 'rallygrid'
		};

		if (Ext.isDefined(filter)) {
			config.storeConfig = {
				filters: rsc.util.toArray(filter)
			};
		}

		if (columns) {
			config.columnCfgs = columns;
			config.autoAddAllModelFieldsAsColumns = false;
		} else {
			config.autoAddAllModelFieldsAsColumns = true;
		}

		config = Ext.apply(config, configOverrides);

		return container.add(config);
	}

	rsc.api.Grid = function(artifactTypeOrStore, columns, filter) {
		var proxy = new rsc.Proxy(function(container) {
			if (Ext.isString(artifactTypeOrStore)) {
				var placeHolder = container.add({
					xtype: 'container'
				});
				Rally.data.ModelFactory.getModel({
					type: artifactTypeOrStore || 'UserStory',
					success: function(model) {
						this.cmp = addGridTo(placeHolder, columns, filter, {
							model: model
						});
					},
					scope: this
				});
			} else {
				this.cmp = addGridTo(container, convertStringColumns(columns), filter, {
					store: artifactTypeOrStore
				});
			}
		});

		return proxy;
	};
})();