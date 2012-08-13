rsc.api.Link = function(title, urlOrTag) {
	var proxy = new rsc.Proxy(function(container) {
		this.cmp = container.add({
			xtype: 'rallybutton',
			text: title,
			handler: this._onClick
		});
	});

	proxy._onClick = function(button, e, eOpts) {
		e.stopEvent();

		if(urlOrTag.indexOf('http:') > -1) {
			window.location.href = urlOrTag;
		} else {
			rsc.api.goToPage(urlOrTag);
		}
	}

	return proxy;	
};
