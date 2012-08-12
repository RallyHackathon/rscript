
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

