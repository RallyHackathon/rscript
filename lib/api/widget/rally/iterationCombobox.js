
rsc.api.iterationCombobox = function() {
	var promise = new rsc.Promise(function(container) {
		this.cmp = container.add({
			xtype: 'rallyiterationcombobox'
		});
	});

	promise.defineEventProperties('ready', 'change');

	promise.surfaceMethods({
		getDisplayValue: 'value',
		getValue: 'ref',
		getQueryFromSelected: 'filter'
	});

	return promise;
};
