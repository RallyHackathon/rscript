rsc.api.flow = function(configOrChild, varargs) {
	var children = Ext.Array.toArray(arguments);
	var config;

	if (configOrChild && !configOrChild.isRscProxy) {
		config = configOrChild;
		children = Ext.Array.remove(children, config);
	} else {
		config = {};
	}
	config.layout = 'column';

	var args = [config].concat(children);
	return rsc.api.stack.apply(rsc.stack, args);
};