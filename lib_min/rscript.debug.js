(function() {
	this.rsc = this.rsc || {};
	this.rsc.global = this;
})();

rsc.launch = function(varargs) {
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



rsc.stack = function(configOrChild, childrenOrUndefined) {
	var container;
	var children = [];
	var config = {};

	if(configOrChild && configOrChild.isRscPromise) {
		children.push(configOrChild);
		children = Ext.Array.merge(children, childrenOrUndefined || []);
	} else if(configOrChild) {
		config = configOrChild;
		children = childrenOrUndefined || [];
	}

	var promise = new rsc.Promise(function(parentContainer) {
		config = Ext.applyIf({
			xtype: 'container'
		}, config);

		container = parentContainer.add(config);
	});

	return promise;
};


rsc.text = function(sizeOrText, textOrUndefined) {
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
};




(function() {
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
		var src = findSrc();

		if(src) {
			new rsc.Compiler(rsc).execute(src);
		}
	});
})();

