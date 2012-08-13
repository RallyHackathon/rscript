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

rsc.api.launch = function(bodyItems, pages, dockedItems) {
	
	bodyItems = rsc.util.toArray(bodyItems);
	pages = rsc.util.toArray(pages);
	dockedItems = rsc.util.toArray(dockedItems);

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

	rsc.__root__ = rootContainer.down('#' + rsc.RootId);

	var mainCard = rsc.__root__.add({
		xtype: 'container',
		width: '100%',
		height: '100%',
		itemId: rsc.api.HomeTag
	});

	// main body items and pages
	Ext.Array.each(bodyItems.concat(pages), function(item) {
		item = rsc.util.stringToHtml(item);
		item.resolve(mainCard);
	});

	// docked items
	var tempContainer = Ext.widget('container');
	Ext.Array.each(dockedItems, function(dockedItem) {
		dockedItem.resolve(tempContainer);
	});

	tempContainer.items.each(function(item) {
		rsc.__root__.addDocked(item);
	});

	if (rsc.api.launch.initialTag) {
		rootContainer.setToPage(rsc.api.launch.initialTag);
		delete rsc.api.launch.initialTag;
	}
};