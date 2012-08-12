rsc.api.launch = function(varargs) {
	var homeCardId = '__rscriptHomeCard__';

	var items = Ext.Array.toArray(arguments);

	var rootContainer = Ext.widget('container', {
		renderTo: Ext.getBody(),
		width: '100%',
		height: '100%',
		layout: 'card',
		itemId: 'rscriptRoot',

		setToPage: function(tag) {
			var page = this.down('#' + tag);
			if(page) {
				this.layout.setActiveItem(page);
			}
		},
		goHome: function() {
			this.setToPage(homeCardId);
		}
	});

	window.rsc.__root__ = rootContainer;

	var mainCard = rootContainer.add({
		xtype: 'container',
		width: '100%',
		height: '100%',
		itemId: homeCardId
	});

	Ext.Array.each(items, function(item) {
		item.resolve(mainCard);
	});
};


