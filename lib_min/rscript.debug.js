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

	var promise = new rsc.Promise(function(container) {
		this.cmp = container.add({
			xtype: 'rallyaddnew',
			recordTypes: types,
			ignoredRequiredFields: ignoredFields,
			showAddWithDetails: false
		});
	});

	promise.defineEventProperties('recordadd', {
		beforerecordadd: function(callback) {
			return function(a, e) {
				callback(new rsc.Record(e.record));
			};
		}
	});

	return promise;
};



rsc.api.cardboard = function(types, attribute) {
	if(Ext.isObject(types)) {
		types = [types]
	}

	var promise = new rsc.Promise(function(container) {
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

	promise.surfaceMethods('refresh');

	Object.defineProperty(promise, 'filter', {
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

	return promise;
};


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

rsc.api.stack = function(configOrChild, varargs) {
	var children = Ext.Array.toArray(arguments);
	var config = {};

	if(configOrChild && !configOrChild.isRscPromise) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	}

	var promise = new rsc.Promise(function(parentContainer) {
		config = Ext.applyIf({
			xtype: 'container'
		}, config);

		this.cmp = parentContainer.add(config);

		Ext.Array.each(children, function(child) {
			child.resolve(this.cmp);
		}, this);
	});

	promise.add = function(promise) {
		if(!this.cmp) {
			children.push(promise);
		} else {
			promise.resolve(this.cmp);
		}
	};

	return promise;
};


rsc.api.text = function(sizeOrText, textOrUndefined) {
	var text = Ext.isString(sizeOrText) ? sizeOrText : (textOrUndefined || '');
	var size = Ext.isNumber(sizeOrText) ? sizeOrText : 12;

	var promise = new rsc.Promise(function(parentContainer) {
		this.cmp = parentContainer.add({
			xtype: 'container',
			html: text,
			style: {
				fontSize: size + 'px'
			}
		});
	});

	return promise;
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

rsc.Record = function(extRecord) {
	return extRecord;
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

