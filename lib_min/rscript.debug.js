(function() {
	this.rsc = this.rsc || {};
	this.rsc.api = this.rsc.api || {};

	this.rsc.global = this;
})();

rsc.api.launch = function(varargs) {
	var items = Ext.Array.toArray(arguments);

	var rootContainer = Ext.widget('container', {
		renderTo: Ext.getBody(),
		width: '100%',
		height: '100%'
	});

	Ext.Array.each(items, function(item) {
		item.resolve(rootContainer);
	});
};


rsc.api.flow = function(configOrChild, varargs) {
	var children = Ext.Array.toArray(arguments);
	var config;

	if (configOrChild && !configOrChild.isRscPromise) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	} else {
		config = {};
	}
	config.layout = 'column';

	var args = [config].concat(children);
	return rsc.api.stack.apply(rsc.stack, args);
};
rsc.api.addNew = function(types, ignoredFields) {
	if(Ext.isObject(types)) {
		types = [types];
	}

	if(Ext.isObject(ignoredFields)) {
		ignoredFields = [ignoredFields];
	}

	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'rallyaddnew',
			recordTypes: types,
			ignoredRequiredFields: ignoredFields,
			showAddWithDetails: false
		});
	});

	proxy.defineEventProperties('recordadd', {
		beforerecordadd: function(callback) {
			return function(a, e) {
				callback(new rsc.Record(e.record));
			};
		}
	});

	return proxy;
};



rsc.api.cardboard = function(types, attribute) {
	if(Ext.isObject(types)) {
		types = [types]
	}

	var proxy = new rsc.Proxy(function(container) {
		var config = {
			xtype: 'rallycardboard',
			types: types,
			attribute: attribute
		};

		if(this.pending.filter) {
			config.storeConfig = {
				filters: [this.pending.filter]
			};
			delete this.pending.filter;
		}

		this.cmp = container.add(config);
	});

	proxy.surfaceMethods('refresh');

	Object.defineProperty(proxy, 'filter', {
		set: function(f) {
			if(this.cmp) {
				this.cmp.refresh({
					storeConfig: {
						filters: [f]
					}
				});
			} else {
				this.pending.filter = f;
			}
		}
	});

	return proxy;
};


rsc.api.iterationCombobox = function() {
	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'rallyiterationcombobox'
		});
	});

	proxy.defineEventProperties('ready', 'change');

	proxy.surfaceMethodsAsProperties({
		getDisplayValue: 'value',
		getValue: 'ref',
		getQueryFromSelected: 'filter'
	});

	return proxy;
};

rsc.api.stack = function(configOrChild, varargs) {
	var children = Ext.Array.toArray(arguments);
	var config = {};

	if(configOrChild && !configOrChild.isRscProxy) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	}

	var proxy = new rsc.Proxy(function(parentContainer) {
		config = Ext.applyIf({
			xtype: 'container'
		}, config);

		this.cmp = parentContainer.add(config);

		Ext.Array.each(children, function(child) {
			child.resolve(this.cmp);
		}, this);
	});

	proxy.add = function(proxy) {
		if(!this.cmp) {
			children.push(proxy);
		} else {
			proxy.resolve(this.cmp);
		}
	};

	return proxy;
};


rsc.api.text = function(sizeOrText, textOrUndefined) {
	var text = Ext.isString(sizeOrText) ? sizeOrText : (textOrUndefined || '');
	var size = Ext.isNumber(sizeOrText) ? sizeOrText : 12;

	var proxy = new rsc.Proxy(function(parentContainer) {
		this.cmp = parentContainer.add({
			xtype: 'container',
			html: text,
			style: {
				fontSize: size + 'px'
			}
		});
	});

	return proxy;
};



rsc.Compiler = function(env) {
	this.env = env || {};
};

rsc.Compiler.prototype = {
	compile: function(src) {
		if(!Ext.isString(src)) {
			throw new Error('rsc.Compiler.compile, src is required');
		}

		var args = [];
		Ext.Object.each(this.env, function(key, value) {
			if(key.indexOf('_') !== 0) {
				args.push(key);
			}
		});

		args.push(src);

		return Function.apply(Function, args);
	},

	execute: function(src) {
		var func = this.compile(src);

		var args = [];

		Ext.Object.each(this.env, function(key, value) {
			if(key.indexOf('_') !== 0) {
				args.push(value);
			}
		});
		
		return func.apply(null, args);
	}
};

rsc.Proxy = function(resolve) {
	this._resolve = resolve ||
	function() {};

	this.pending = {};

	// cannot place on prototype, must be at the 'leaf'
	Object.defineProperty(this, 'isRscProxy', {
		value: true,
		enumerable: true,
		writable: false,
		configurable: false
	});
};

rsc.Proxy.prototype = {
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

		Ext.Object.each(config, function(cmpMethodName, ProxyMethodName) {
			this[ProxyMethodName] = function() {
				if (this.cmp && Ext.isFunction(this.cmp[cmpMethodName])) {
					return this.cmp[cmpMethodName].apply(this.cmp, arguments);
				}
			}
		}, this);
	},

	surfaceMethodsAsProperties: function(stringArrayOrConfig) {
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

		Ext.Object.each(config, function(cmpMethodName, ProxyPropertyName) {
			Object.defineProperty(this, ProxyPropertyName, {
				get: function() {
					if (this.cmp && Ext.isFunction(this.cmp[cmpMethodName])) {
						return this.cmp[cmpMethodName].apply(this.cmp, arguments);
					}
				}
			});
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
							if (this.cmp) {
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



(function() {
	function patchSdk() {

		// addnew is calling this, not available in RUI
		Rally.getContextPath = function() {
			return 'https://test7cluster.rallydev.com/slm'
		};
	}

	function findSrc() {
		var scripts = document.getElementsByTagName('script');

		var src;

		Ext.Array.each(scripts, function(script) {
			if(script.type === 'rscript') {
				src = script.innerText;
				return false;
			}
		});

		return src;
	}


	Rally.onReady(function() {
		patchSdk();

		var src = findSrc();

		if(src) {
			new rsc.Compiler(rsc.api).execute(src);
		}
	});
})();

