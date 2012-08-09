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


