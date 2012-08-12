
rsc.api.text = function(sizeOrText, textOrUndefined) {
	var text = Ext.isString(sizeOrText) ? sizeOrText : (textOrUndefined || '');
	var size = Ext.isNumber(sizeOrText) ? sizeOrText : 12;

	var proxy = new rsc.Proxy(function(parentContainer) {
		this.cmp = parentContainer.add({
			xtype: 'container',
			html: text,
			style: {
				fontSize: size + 'px'
			}
		});
	});

	Object.defineProperty(proxy, 'text', {
		get: function() {
			return this.cmp && this.cmp.getEl().dom.innerHTML;
		},
		set: function(t) {
			if(this.cmp) {
				this.cmp.getEl().dom.innerHTML = t;
			} else {
				text = t;
			}
		}
	});

	return proxy;
};


