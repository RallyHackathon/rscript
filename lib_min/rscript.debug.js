(function() {
	this.rsc = this.rsc || {};
	this.rsc.api = this.rsc.api || {};

	this.rsc.global = this;
})();

Object.defineProperty(rsc.api, 'HomeTag', {
	writable: false,
	configurable: false,
	enumerable: true,
	value: '__rscriptHomeCard__'
});

Object.defineProperty(rsc, 'RootId', {
	writable: false,
	configurable: false,
	enumerable: true,
	value: '__rscriptRootId__'
})

rsc.api.launch = function(bodyItems, pages, dockedItems) {
	
	bodyItems = rsc.util.toArray(bodyItems);
	pages = rsc.util.toArray(pages);
	dockedItems = rsc.util.toArray(dockedItems);

	var rootContainer = Ext.widget('container', {
		border: false,
		renderTo: Ext.getBody(),
		width: '100%',
		height: '100%',

		items: [{
			border: false,
			xtype: 'panel',
			layout: 'card',
			itemId: rsc.RootId,
			setToPage: function(tag) {
				var page = this.down('#' + tag);
				if (page) {
					this.layout.setActiveItem(page);
				}
			},
			goHome: function() {
				this.setToPage(rsc.api.HomeTag);
			}
		}]
	});

	rsc.__root__ = rootContainer.down('#' + rsc.RootId);

	var mainCard = rsc.__root__.add({
		xtype: 'container',
		width: '100%',
		height: '100%',
		itemId: rsc.api.HomeTag
	});

	// main body items and pages
	Ext.Array.each(bodyItems.concat(pages), function(item) {
		if(Ext.isString(item)) {
			item = rsc.api.html(item);
		}
		
		item.resolve(mainCard);
	});

	// docked items
	var tempContainer = Ext.widget('container');
	Ext.Array.each(dockedItems, function(dockedItem) {
		dockedItem.resolve(tempContainer);
	});

	tempContainer.items.each(function(item) {
		rsc.__root__.addDocked(item);
	});

	if (rsc.api.launch.initialTag) {
		rootContainer.setToPage(rsc.api.launch.initialTag);
		delete rsc.api.launch.initialTag;
	}
};
rsc.api.checkbox = function(label, checked) {
	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'checkbox',
			boxLabel: label || '',
			checked: !!checked
		});
	});

	proxy.defineEventProperties({
		change: function(callback) {
			return function(checkbox, value) {
				callback(value);
			}
		}
	});

	return proxy;
};
rsc.api.flow = function(configOrChild, varargs) {
	var children = Ext.Array.toArray(arguments);
	var config;

	if (configOrChild && !configOrChild.isRscProxy && !Ext.isString(configOrChild)) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	} else {
		config = {};
	}
	config.layout = 'column';

	var args = [config].concat(children);
	return rsc.api.stack.apply(rsc.stack, args);
};
rsc.api.html = function(sizeOrHtml, htmlOrUndefined) {
	var html = Ext.isString(sizeOrHtml) ? sizeOrHtml : (htmlOrUndefined || '');
	var size = Ext.isNumber(sizeOrHtml) ? sizeOrHtml : 12;

	var proxy = new rsc.Proxy(function(parentContainer) {
		this.cmp = parentContainer.add({
			xtype: 'container',
			html: html,
			style: {
				fontSize: size + 'px'
			}
		});
	});

	Object.defineProperty(proxy, 'html', {
		get: function() {
			return this.cmp && this.cmp.getEl().dom.innerHTML;
		},
		set: function(t) {
			if(this.cmp) {
				this.cmp.getEl().dom.innerHTML = t;
			} else {
				html = t;
			}
		}
	});

	return proxy;
};



rsc.api.link = function(title, urlOrTag) {
	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'rallybutton',
			text: title,
			handler: this._onClick
		});
	});

	proxy._onClick = function(button, e, eOpts) {
		e.stopEvent();

		if(urlOrTag.indexOf('http:') > -1) {
			window.location.href = urlOrTag;
		} else {
			rsc.api.goToPage(urlOrTag);
		}
	}

	return proxy;	
};

rsc.api.page = function(tag, childrenOrUndefined) {
	var children = Ext.Array.toArray(arguments);
	children = Ext.Array.remove(children, tag);

	var proxy = new rsc.Proxy(function(container) {
		var root = container.up('#' + rsc.RootId);

		if(root) {
			this.cmp = root.add({
				xtype: 'container',
				width: '100%',
				height: '100%',
				itemId: tag
			});

			Ext.Array.each(children, function(child) {
				if(Ext.isString(child)) {
					child = rsc.api.html(child);
				}
				child.resolve(this.cmp);
			}, this);
		}

	});

	Object.defineProperty(proxy, 'tag', {
		writable: false,
		enumerable: true,
		configurable: false,
		value: tag
	});

	proxy.add = function(proxy) {
		if(Ext.isString(proxy)) {
			proxy = rsc.api.html(proxy);
		}
		if(this.cmp) {
			proxy.resolve(this.cmp);
		} else {
			children.push(proxy);
		}
	}

	return proxy;
};

rsc.api.goToPage = function(tag) {
	var root = rsc.__root__;

	if(root) {
		root.setToPage(tag);
	} else {
		rsc.api.launch.initialTag = tag;
	}
};


rsc.api.addNew = function(types, ignoredFields) {
	if(Ext.isString(types)) {
		types = [types];
	}

	if(Ext.isString(ignoredFields)) {
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
	if(Ext.isString(types)) {
		types = [types]
	}

	var proxy = new rsc.Proxy(function(container) {
		var config = {
			xtype: 'rallycardboard',
			types: types,
			attribute: attribute || 'ScheduleState'
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

rsc.api.currentUser = function() {
	var user = Ext.clone(Rally.environment.getContext().getUser());

	var proxy = rsc.api.html('&nbsp;' + user._refObjectName + '&nbsp;');

	Ext.Object.each(user, function(key, value) {
		if (!Ext.isFunction(value)) {
			Object.defineProperty(proxy, key, {
				writable: false,
				enumerable: true,
				configurable: false,
				value: value
			});
		}
	});

	return proxy;
};
rsc.api.grid = function(artifactType, columns, filter) {
	
	var proxy = new rsc.Proxy(function(container) {
		var placeHolder = container.add({
			xtype: 'container'
		});
	
		Rally.data.ModelFactory.getModel({
			type: artifactType || 'UserStory',
			success: function(model) {
				var config = {
					xtype: 'rallygrid',
					model: model
				};

				if(Ext.isArray(filter)) {
					config.storeConfig = {
						filters: filter
					};
				} else if(Ext.isObject(filter)) {
					config.storeConfig = {
						filters: [filter]
					};
				}

				if(columns) {
					config.columnCfgs = columns;
					config.autoAddAllModelFieldsAsColumns = false;
				} else {
					config.autoAddAllModelFieldsAsColumns = true;
				}

				this.cmp = placeHolder.add(config);
			},
			scope: this
		});
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

	if(configOrChild && !configOrChild.isRscProxy && !Ext.isString(configOrChild)) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	}

	var proxy = new rsc.Proxy(function(parentContainer) {
		config = Ext.applyIf({
			xtype: 'container'
		}, config);

		this.cmp = parentContainer.add(config);

		Ext.Array.each(children, function(child) {
			if(Ext.isString(child)) {
				child = rsc.api.html(child);
			}
			child.resolve(this.cmp);
		}, this);
	});

	proxy.add = function(proxy) {
		if(Ext.isString(proxy)) {
			proxy = rsc.api.html(proxy);
		}
		
		if(!this.cmp) {
			children.push(proxy);
		} else {
			proxy.resolve(this.cmp);
		}
	};

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


rsc.util = {
	toArray: function(arg) {
		if(!arg) {
			return [];
		}
		
		return Ext.isArray(arg) ? arg : [arg];
	}
};
