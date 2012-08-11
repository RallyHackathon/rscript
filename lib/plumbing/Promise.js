rsc.Promise = function(resolve) {
	this._resolve = resolve ||
	function() {};

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

	surfaceMethods: function(stringArrayOrConfig) {
		var config;
		if (Ext.isString(stringArrayOrConfig)) {
			config = {};
			config[stringArrayOrConfig] = stringArrayOrConfig;
		} else if (Ext.isArray(stringArrayOrConfig)) {
			config = {};
			Ext.Array.each(stringArrayOrConfig, function(method) {
				config[method] = method;
			});
		} else {
			config = stringArrayOrConfig;
		}

		Ext.Object.each(config, function(cmpMethodName, promiseMethodName) {
			this[promiseMethodName] = function() {
				if (this.cmp && Ext.isFunction(this.cmp[cmpMethodName])) {
					return this.cmp[cmpMethodName].apply(this.cmp, arguments);
				}
			}
		}, this);
	},

	defineEventProperties: function(varargs) {
		var properties = Ext.Array.toArray(arguments);

		Ext.Array.each(properties, function(property) {
			if (Ext.isString(property)) {
				Object.defineProperty(this, property, {
					set: function(callback) {
						if (this.cmp) {
							this.cmp.on(property, callback);
						} else {
							this.pending[property] = callback;
						}
					}
				});
			} else {
				Ext.Object.each(property, function(eventName, callbackCreator) {
					Object.defineProperty(this, eventName, { 
						set: function(callback) {
							var wrapped = callbackCreator(callback);
							if(this.cmp) {
								this.cmp.on(eventName, wrapped);
							} else {
								this.pending[eventName] = wrapped;
							}
						}
					});
				}, this);	
			}
		}, this);
	}
};