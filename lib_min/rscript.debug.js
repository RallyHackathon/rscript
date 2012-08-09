(function() {
	this.rsc = this.rsc || {};
	this.rsc.global = this;
})();


rsc.Compiler = function(env) {
	this.env = env || {};
};

rsc.Compiler.prototype = {
	compile: function(src) {
		if(!_.isString(src)) {
			throw new Error('rsc.Compiler.compile, src is required');
		}

		var args = [];
		_.each(this.env, function(value, key) {
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

		_.each(this.env, function(value, key) {
			if(key.indexOf('_') !== 0) {
				args.push(value);
			}
		});
		
		return func.apply(null, args);
	}
};

