describe('Html', function() {
	var mockContainer;

	beforeEach(function() {
		mockContainer = {
			add: function(givenConfig) {
				this.config = givenConfig;
			}
		};
	});

	it('should not blow up with no parameters', function() {
		var h = new rsc.api.Html();

		h.resolve(mockContainer);

		var config = mockContainer.config;

		expect(Ext.isObject(config)).toBe(true);
		expect(config.xtype).toBe('container');
		expect(config.style.fontSize).toBeDefined();
		expect(config.html).toBe('');
	});

	it('should accept just a size parameter', function() {
		var size = 20;
		var h = new rsc.api.Html(size);

		h.resolve(mockContainer);

		var config = mockContainer.config;

		expect(config.style.fontSize).toBe('' + size + 'px');
	});

	it('should accept just a html parameter', function() {
		var html = 'hello';
		var h = new rsc.api.Html(html);

		h.resolve(mockContainer);

		var config = mockContainer.config;

		expect(config.html).toEqual(html);
		expect(config.style.fontSize).toBeDefined();
	});

	it('should accept both a size and html parameter', function() {
		var size = 40;
		var html = 'big html';

		var h = new rsc.api.Html(size, html);

		h.resolve(mockContainer);

		var config = mockContainer.config;

		expect(config.html).toEqual(html);
		expect(config.style.fontSize).toBe('' + size + 'px');
	});
});

