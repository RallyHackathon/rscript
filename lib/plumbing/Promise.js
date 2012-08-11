rsc.Promise = function(resolve) {
	this._resolve = resolve || function() {};

	this.pending = {};

	// cannot place on prototype, must be at the 'leaf'
	Object.defineProperty(this, 'isRscPromise', {
		value: true,
		enumerable: true,
		writable: false,
		configurable: false
	});
};

rsc.Promise.prototype = {
	_resolvePending: function() {
		if (this.cmp) {
			Ext.Object.each(this.pending, function(key, value) {
				this.cmp.on(key, value);
			}, this);
		}
		this.pending = {};
	},

	resolve: function() {
		this._resolve.apply(this, arguments);
		this._resolvePending();
	},

	defineEventProperties: function(varargs) {
		var properties = Ext.Array.toArray(arguments);

		Ext.Array.each(properties, function(property) {
			Object.defineProperty(this, property, {
				set: function(callback) {
					if (this.cmp) {
						this.cmp.on(property, callback);
					} else {
						this.pending[property] = callback;
					}
				}
			});
		}, this);
	}
};