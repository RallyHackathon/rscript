rsc.api.Flow = function(configOrChild, varargs) {
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
	return rsc.api.Stack.apply(rsc.Stack, args);
};