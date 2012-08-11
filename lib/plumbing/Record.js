

rsc.Record = function(extRecord) {
	this._extRecord = extRecord;
	this._wrap();
};

rsc.Record.prototype = {
	_wrap: function() {
		Ext.Array.each(this._extRecord.self.getFields(), function(field) {
			Object.defineProperty(this, field.name, {
				set: function(value) {
					this._extRecord.set(field.name, value);
				},
				get: function() {
					return this._extRecord.get(field.name);
				},
				enumerable: true
			});
		}, this);

	}
};



