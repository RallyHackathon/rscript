
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


