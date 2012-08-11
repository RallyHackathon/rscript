
rsc.api.iterationCombobox = function() {
	var promise = new rsc.Promise(function(container) {
		this.cmp = container.add({
			xtype: 'rallyiterationcombobox'
		});
	});

	promise.defineEventProperties('ready', 'change');

	Object.defineProperty(promise, 'value', {
		get: function() {
			return promise.cmp && promise.cmp.getDisplayValue();
		}
	});

	Object.defineProperty(promise, 'ref', {
		get : function() {
			return promise.cmp && promise.cmp.getValue();
		}
	});

	Object.defineProperty(promise, 'filter', {
		get: function() {
			return promise.cmp && promise.cmp.getQueryFromSelected();
		}
	});

	return promise;
};
