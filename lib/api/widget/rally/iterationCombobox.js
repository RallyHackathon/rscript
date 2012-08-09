
rsc.api.iterationCombobox = function() {
	var combobox;

	var promise = new rsc.Promise(function(container) {
		combobox = container.add({
			xtype: 'rallyiterationcombobox'
		});

		Ext.Object.each(promise.pending, function(key, value) {
			combobox.on(key, value);
		});
		promise.pending = {};
	});

	promise.pending = {};

	Object.defineProperty(promise, 'value', {
		get: function() {
			return combobox && combobox.getDisplayValue();
		}
	});

	Object.defineProperty(promise, 'ref', {
		get : function() {
			return combobox && combobox.getValue();
		}
	});

	Object.defineProperty(promise, 'filter', {
		get: function() {
			return combobox && combobox.getQueryFromSelected();
		}
	});

	Object.defineProperty(promise, 'ready', {
		set: function(callback) {
			if(combobox) {
				combobox.on('ready', callback);
			} else {
				this.pending.ready = callback
			}
		}
	});

	Object.defineProperty(promise, 'change', {
		set: function(callback) {
			if(combobox) {
				combobox.on('change', callback);
			} else {
				this.pending.change = callback;
			}
		}
	});

	return promise;
};
