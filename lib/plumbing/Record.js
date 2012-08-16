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

rsc.Record.wrap = function(records) {
	var givenArray = Ext.isArray(records);

	var wrapped = [];

	records = rsc.util.toArray(records);

	records.forEach(function(record) {
		wrapped.push(new rsc.Record(record));
	});

	return givenArray ? wrapped : wrapped[0];
};

rsc.Record.wrapModel = function(model) {
	var wrap = {};

	Object.defineProperty(wrap, 'name', {
		writable: false,
		configurable: false,
		enumerable: false,
		value: model.displayName
	});

	Ext.Array.each(model.getFields(), function(field) {
		Object.defineProperty(wrap, field.name, {
			writable: false,
			configurable: false,
			enumerable: true,
			value: field
		})
	});

	wrap.getEditableAttributes = function() {
		if (!this._editableAttributes) {
			this._editableAttributes = {};
			Ext.Array.each(model.getFields(), function(field) {
				if (field.attributeDefinition && field.attributeDefinition.AttributeType !== 'COLLECTION') {
					this._editableAttributes[field.name] = field;
				}
			}, this);
		}
		return this._editableAttributes;
	};

	return wrap;
};