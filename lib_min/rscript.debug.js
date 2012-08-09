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

	if(configOrChild && !configOrChild.isRscPromise) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	} else {
		config = {};
	} 
	config.layout = 'column';
	
	var args = [config].concat(children);
	return rsc.api.stack.apply(rsc.stack, args);
};


rsc.api.addNew = function(types, varargs_ignoredFields) {
	var addNew;
	var ignored = Ext.Array.toArray(arguments);
	ignored = Ext.Array.remove(ignored, types);

	if(Ext.isObject(types)) {
		types = [types];
	}

	var promise = new rsc.Promise(function(container) {
		addNew = container.add({
			xtype: 'rallyaddnew',
			recordTypes: types,
			ignoredRequiredFields: ignored,
			showAddWithDetails: false
		});

		Ext.Object.each(promise.pending, function(key, value) {
			addNew.on(key, value);
		});
		promise.pending = {};
	});

	promise.pending = {};

	Object.defineProperty(promise, 'beforerecordadd', {
		set: function(callback) {
			if(addNew) {
				addNew.on('beforerecordadd', callback);
			} else {
				this.pending.beforerecordadd = callback;
			}
		}
	});

	Object.defineProperty(promise, 'recordadd', {
		set: function(callback) {
			if(addNew) {
				addNew.on('recordadd', callback);
			} else {
				this.pending.recordadd = callback;
			}
		}
	});

	return promise;
};



rsc.api.cardboard = function(type, attribute) {
	var cardboard;

	var promise = new rsc.Promise(function(container) {
		var config = {
			xtype: 'rallycardboard',
			types: [type],
			attribute: attribute
		};

		if(promise.pending.filter) {
			config.storeConfig = {
				filters: [promise.pending.filter]
			};
			delete promise.pending.filter;
		}

		cardboard = container.add(config);
	});

	promise.pending = {};

	Object.defineProperty(promise, 'filter', {
		set: function(f) {
			if(cardboard) {
				cardboard.refresh({
					storeConfig: {
						filters: [f]
					}
				});
			} else {
				promise.pending.filter = f;
			}
		}
	});

	return promise;
};


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

rsc.api.stack = function(configOrChild, varargs) {
	var container;
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

		container = parentContainer.add(config);

		Ext.Array.each(children, function(child) {
			child.resolve(container);
		});
	});

	promise.add = function(promise) {
		if(!container) {
			children.push(promise);
		} else {
			promise.resolve(container);
		}
	};

	return promise;
};


rsc.api.text = function(sizeOrText, textOrUndefined) {
	var container;
	var text = Ext.isString(sizeOrText) ? sizeOrText : (textOrUndefined || '');
	var size = Ext.isNumber(sizeOrText) ? sizeOrText : 12;

	var promise = new rsc.Promise(function(parentContainer) {
		container = parentContainer.add({
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
	this.resolve = resolve;
	this.isRscPromise = true;
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

