Object.defineProperty(rsc.api, 'HomeTag', {
	writable: false,
	configurable: false,
	enumerable: true,
	value: '__rscriptHomeCard__'
});

Object.defineProperty(rsc, 'RootId', {
	writable: false,
	configurable: false,
	enumerable: true,
	value: '__rscriptRootId__'
})

rsc.api.launch = function(varargs) {
	var items = Ext.Array.toArray(arguments);

	var rootContainer = Ext.widget('container', {
		border: false,
		renderTo: Ext.getBody(),
		width: '100%',
		height: '100%',

		items: [{
			border: false,
			xtype: 'panel',
			layout: 'card',
			itemId: rsc.RootId,
			setToPage: function(tag) {
				var page = this.down('#' + tag);
				if (page) {
					this.layout.setActiveItem(page);
				}
			},
			goHome: function() {
				this.setToPage(rsc.api.HomeTag);
			}
		}]
	});

	rsc.__root__ = rootContainer.items.items[0];

	var mainCard = rsc.__root__.add({
		xtype: 'container',
		width: '100%',
		height: '100%',
		itemId: rsc.api.HomeTag
	});

	Ext.Array.each(items, function(item) {
		item.resolve(mainCard);
	});

	if (rsc.api.launch.initialTag) {
		rootContainer.setToPage(rsc.api.launch.initialTag);
		delete rsc.api.launch.initialTag;
	}
};