(function() {
	this.rsc = this.rsc || {};
	this.rsc.global = this;
})();


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
		container = this.add({
			xtype: 'container',
			html: text,
			style: {
				fontSize: size + 'px'
			}
		});
	});

	return promise;
};


